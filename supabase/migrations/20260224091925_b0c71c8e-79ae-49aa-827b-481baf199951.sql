
-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE public.rental_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed');
CREATE TYPE public.photo_type AS ENUM ('before', 'after');
CREATE TYPE public.dispute_status AS ENUM ('open', 'resolved_owner', 'resolved_renter', 'closed');
CREATE TYPE public.item_status AS ENUM ('draft', 'active', 'paused', 'archived');

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  rentals_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ITEMS (listings)
-- ============================================
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_per_day INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  min_days INTEGER NOT NULL DEFAULT 1,
  conditions TEXT,
  images TEXT[] DEFAULT '{}',
  status public.item_status NOT NULL DEFAULT 'active',
  location TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items are viewable by everyone"
  ON public.items FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create items"
  ON public.items FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own items"
  ON public.items FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own items"
  ON public.items FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX idx_items_category ON public.items(category);
CREATE INDEX idx_items_owner ON public.items(owner_id);
CREATE INDEX idx_items_status ON public.items(status);

-- ============================================
-- RENTALS
-- ============================================
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  status public.rental_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rental participants can view"
  ON public.rentals FOR SELECT
  USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create rentals"
  ON public.rentals FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Rental participants can update"
  ON public.rentals FOR UPDATE
  USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE INDEX idx_rentals_item ON public.rentals(item_id);
CREATE INDEX idx_rentals_renter ON public.rentals(renter_id);
CREATE INDEX idx_rentals_owner ON public.rentals(owner_id);

-- ============================================
-- RENTAL PHOTOS (фотофиксация)
-- ============================================
CREATE TABLE public.rental_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type public.photo_type NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rental_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rental participants can view photos"
  ON public.rental_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

CREATE POLICY "Rental participants can upload photos"
  ON public.rental_photos FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Rental participants can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
      AND r.status = 'completed'
    )
  );

CREATE INDEX idx_reviews_target ON public.reviews(target_user_id);

-- ============================================
-- DISPUTES
-- ============================================
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL,
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status public.dispute_status NOT NULL DEFAULT 'open',
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rental participants can view disputes"
  ON public.disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

CREATE POLICY "Rental participants can create disputes"
  ON public.disputes FOR INSERT
  WITH CHECK (
    auth.uid() = opened_by AND
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

-- ============================================
-- MESSAGES (чат)
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rental participants can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

CREATE POLICY "Rental participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

CREATE POLICY "Sender can mark messages as read"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals r
      WHERE r.id = rental_id
      AND (r.renter_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

CREATE INDEX idx_messages_rental ON public.messages(rental_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('rental-photos', 'rental-photos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Item images: public read, authenticated upload to own folder
CREATE POLICY "Item images are public" ON storage.objects
  FOR SELECT USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own item images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own item images" ON storage.objects
  FOR DELETE USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Rental photos: only participants
CREATE POLICY "Rental photos accessible to participants" ON storage.objects
  FOR SELECT USING (bucket_id = 'rental-photos');

CREATE POLICY "Authenticated users can upload rental photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'rental-photos' AND auth.uid() IS NOT NULL);

-- Avatars: public read, own upload
CREATE POLICY "Avatars are public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON public.rentals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
