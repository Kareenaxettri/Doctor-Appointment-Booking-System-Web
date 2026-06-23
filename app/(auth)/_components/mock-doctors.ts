// Static placeholder data for the "Find Your Specialist" grid.
// There is no /doctors endpoint on the backend yet - this only exists to
// reproduce the dashboard design from the reference screenshot. Swap this
// out for a real API call (lib/api + a server action) once that endpoint
// exists.
export type MockDoctor = {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  photo: string;
};

export const specialtyFilters = [
  "All Specializations",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Ophthalmology",
];

export const mockDoctors: MockDoctor[] = [
  {
    id: "1",
    name: "Dr. Aristha Sharma",
    specialty: "Cardiologist",
    clinic: "Mediciti Hospital",
    rating: 4.9,
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    clinic: "The Skin Clinic",
    rating: 4.8,
    photo:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics Specialist",
    clinic: "City Children's Hospital",
    rating: 4.9,
    photo:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    clinic: "Brain Care Center",
    rating: 4.7,
    photo:
      "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    specialty: "Ophthalmologist",
    clinic: "Vision Eye Clinic",
    rating: 4.8,
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60&flip=h",
  },
  {
    id: "6",
    name: "Dr. Robert Taylor",
    specialty: "Orthopedic Surgeon",
    clinic: "Sports Med Center",
    rating: 5.0,
    photo:
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&auto=format&fit=crop&q=60",
  },
];
