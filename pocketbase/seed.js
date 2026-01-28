/**
 * PocketBase Seed Script
 *
 * Seeds the industries and screen_types collections with default data.
 *
 * Usage:
 *   1. Make sure PocketBase is running (docker compose up -d)
 *   2. Create an admin account at http://localhost:8090/_/
 *   3. Import the schema from pb_schema.json in the admin UI
 *   4. Run: node pocketbase/seed.js
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

const industries = [
  { id: 'wlgyec94hb473w3', name: 'Lifestyle' },
  { id: '3jf1g8fet5w6j4o', name: 'Food & Drink' },
  { id: '8cbeym70k62u6py', name: 'Education' },
  { id: 'fujpvam8c772d84', name: 'Productivity' },
  { id: 't67y5p2rl3cocjg', name: 'Social Networking' },
  { id: 'qgaib9dtyaxl5bx', name: 'Shopping' },
  { id: '5wtn14f0sy9q3dj', name: 'Business' },
  { id: 'hrw2b9alrnpas9v', name: 'Entertainment' },
  { id: '4df1jv24urk5d1r', name: 'Finance' },
  { id: 'kics7dqstxtprij', name: 'Health & Fitness' },
  { id: '99izjdj82hcqjb4', name: 'Travel & Transportation' },
  { id: '0q14aayukzcox5k', name: 'Sports' },
  { id: '5l00t9utzfnrj19', name: 'Utilities' },
  { id: 'dbvdke0vrt75xbn', name: 'Graphics & Design' },
  { id: '8w0sokhij3jamjm', name: 'Music, Audio & Video' },
  { id: 'sj2qoeqomaw9mnh', name: 'News' },
];

const screenTypes = [
  { id: 't58ghfc9tiqh8cn', name: 'Dashboard & Charts' },
  { id: '8m1l9dlolki35c1', name: 'Home' },
  { id: 'tel5bqa3hok395g', name: 'Onboarding & Tutorial' },
  { id: '2msi938lf99k52q', name: 'Signup and Login' },
  { id: 'n9nyem18zqkk9bc', name: 'Checkout' },
  { id: 'uh2femb5c705or5', name: 'Subscription & Pricing Page' },
  { id: 'xkhhhtlkvrg7sx2', name: 'My Account & Profile' },
  { id: 'gaxusrilbjsji11', name: 'Activity Feed & Notifications' },
  { id: '3s23adx11cb233d', name: 'Settings & Preferences' },
  { id: 'fd5g8z67y4oznwg', name: 'Blog Page' },
  { id: 'hyzkz35osms1cvu', name: 'Contact Page' },
  { id: '0pk718p0vq6udg5', name: 'About Page & FAQ' },
  { id: 't0dces7z6lyfrmq', name: 'Splash Screen & 404 Page' },
  { id: 'h8ppjxi8x6d85ff', name: 'Cart & Bags' },
  { id: 'pjrvrsl6ce3uw8a', name: 'Product Details' },
  { id: 'fzno4lotcik64vr', name: 'Calendar' },
  { id: '89h9bvy506vcgxi', name: 'Search and Discovery' },
];

async function seed() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Error: Please set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD environment variables');
    console.error('\nExample:');
    console.error('  export POCKETBASE_ADMIN_EMAIL=admin@example.com');
    console.error('  export POCKETBASE_ADMIN_PASSWORD=yourpassword');
    console.error('  node pocketbase/seed.js');
    process.exit(1);
  }

  const pb = new PocketBase(POCKETBASE_URL);

  try {
    // Authenticate as admin
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Authenticated as admin\n');

    // Seed industries
    console.log('Seeding industries...');
    for (const industry of industries) {
      try {
        await pb.collection('industries').create(industry);
        console.log(`  + ${industry.name}`);
      } catch (err) {
        if (err.status === 400 || err.status === 409) {
          console.log(`  - ${industry.name} (already exists)`);
        } else {
          throw err;
        }
      }
    }

    // Seed screen types
    console.log('\nSeeding screen types...');
    for (const screenType of screenTypes) {
      try {
        await pb.collection('screen_types').create(screenType);
        console.log(`  + ${screenType.name}`);
      } catch (err) {
        if (err.status === 400 || err.status === 409) {
          console.log(`  - ${screenType.name} (already exists)`);
        } else {
          throw err;
        }
      }
    }

    console.log('\n✓ Seeding complete!');
    console.log('\nNote: The ui_screens collection needs to be populated separately with the UI screenshot dataset.');
    console.log('To request access to the dataset, please contact the HCD Lab: jinghui.cheng@polymtl.ca');

  } catch (error) {
    console.error('Error seeding database:', error.message || error);
    process.exit(1);
  }
}

seed();
