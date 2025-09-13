export interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  before_image?: string;
  after_image?: string;
  client_name?: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image: string;
  caption: string;
  category?: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  review_text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SliderImage {
  id: string;
  image: string;
  caption: string;
  created_at: string;
}

export interface AdminCredentials {
  id: string;
  username: string;
  password: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}