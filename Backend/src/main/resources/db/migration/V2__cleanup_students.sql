-- 1. Create student records for users with role 'STUDENT' who don't have one
INSERT INTO public.students (id, user_id, roll_number, image_url)
SELECT 
    gen_random_uuid(), 
    u.id, 
    'TEMP_' || substr(u.id::text, 1, 8), 
    NULL
FROM public.users u
LEFT JOIN public.students s ON u.id = s.user_id
WHERE u.role = 'STUDENT' AND s.id IS NULL;

-- 2. Ensure all students have a roll number (even if they were created manually before)
-- Note: V1 already has roll_number NOT NULL, so this is just a safety check if constraints were added later.
UPDATE public.students 
SET roll_number = 'TEMP_' || substr(user_id::text, 1, 8) 
WHERE roll_number IS NULL OR roll_number = '';
