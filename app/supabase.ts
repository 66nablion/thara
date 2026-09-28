import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://trasyitbiisjhcyzvkka.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyYXN5aXRiaWlzamhjeXp2a2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDU4OTIsImV4cCI6MjEwNDU4MTg5Mn0.aSQuWQ8NMukO43it9ehnwrinCe_oi3PUprXmp8QUOic'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
