import { createClient } from '@supabase/supabase-js';

// This script uses the Service Role Key to safely bypass email verification 
// and force-create an admin user for your dashboard.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Make sure your .env.local file has both of these keys set!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  // ⬇️ CHANGE THESE TO YOUR PREFERRED ADMIN CREDENTIALS ⬇️
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123';
  
  console.log(`⏳ Attempting to create admin user: ${adminEmail}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true // Automatically confirms the email so you can log in immediately
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log(`✅ User ${adminEmail} already exists! Attempting to update password instead...`);
      
      // If user exists, update their password
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users.find(u => u.email === adminEmail);
      
      if (existingUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: adminPassword }
        );
        if (updateError) {
          console.error("❌ Failed to update password:", updateError.message);
        } else {
          console.log(`✅ Password successfully updated for ${adminEmail}!`);
          console.log(`🔑 You can now log in at /login with password: ${adminPassword}`);
        }
      }
    } else {
      console.error("❌ Error creating user:", error.message);
    }
  } else {
    console.log("🎉 Admin user created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log("You can now log in at http://localhost:3000/login");
  }
}

createAdminUser();
