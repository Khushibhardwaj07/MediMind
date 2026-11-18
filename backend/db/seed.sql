-- SAMPLE ranges for development only.
-- Real lab reports print their own ranges, and ranges differ by lab, age and sex.
-- Always verify these against a trusted source before treating them as correct.
-- ON CONFLICT DO NOTHING lets us run this file again without duplicates.
INSERT INTO reference_ranges (test_name, unit, min_value, max_value, sex) VALUES
  ('Hemoglobin',        'g/dL',     12.0,  17.5, 'any'),
  ('RBC',               'million/uL', 4.2,   5.9, 'any'),
  ('WBC',               'thousand/uL', 4.0, 11.0, 'any'),
  ('Platelets',         'thousand/uL', 150,  450, 'any'),
  ('Fasting Glucose',   'mg/dL',    70,    99,   'any'),
  ('HbA1c',             '%',        4.0,   5.6,  'any'),
  ('Total Cholesterol', 'mg/dL',    0,     200,  'any'),
  ('LDL Cholesterol',   'mg/dL',    0,     100,  'any'),
  ('HDL Cholesterol',   'mg/dL',    40,    100,  'any'),
  ('Triglycerides',     'mg/dL',    0,     150,  'any'),
  ('Creatinine',        'mg/dL',    0.6,   1.3,  'any'),
  ('ALT',               'U/L',      7,     56,   'any'),
  ('TSH',               'mIU/L',    0.4,   4.0,  'any')
ON CONFLICT (test_name, sex) DO NOTHING;