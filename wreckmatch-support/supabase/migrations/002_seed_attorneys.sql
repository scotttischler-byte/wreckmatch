-- Seed attorney records for WreckMatch (matches sample-attorneys.ts IDs for reference)
-- Run after 001_wreckmatch_initial.sql

insert into public.attorneys (id, name, bio, state, practice_areas, location, website_url)
values
  (
    '11111111-1111-1111-1111-111111111101',
    'Elena Martinez, Esq.',
    'Elena focuses on compassionate representation for car accident survivors. She believes in listening first and explaining options clearly — never pressuring clients to move faster than they''re ready.',
    'TX',
    array['Car accidents', 'Insurance disputes', 'Personal injury'],
    'Austin, TX',
    null
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    'David Chen, Esq.',
    'David helps survivors understand their rights after serious collisions. His approach emphasizes education and informed decision-making at every step.',
    'CA',
    array['Motorcycle accidents', 'Traumatic injury', 'Uninsured motorist claims'],
    'Los Angeles, CA',
    null
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    'Sarah Okonkwo, Esq.',
    'Sarah works with families navigating complex truck accident cases. She is known for clear communication and steady support through long recoveries.',
    'TX',
    array['Truck accidents', 'Wrongful injury', 'Medical liens'],
    'Dallas, TX',
    null
  )
on conflict (id) do nothing;
