/// <reference path="../pb_data/types.d.ts" />

/**
 * Seed migration for UIDEC (PocketBase v0.22)
 * Populates industries and screen_types with default data
 */
migrate((db) => {
  const dao = new Dao(db);

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

  const industriesCol = dao.findCollectionByNameOrId("industries");
  const screenTypesCol = dao.findCollectionByNameOrId("screen_types");

  // Seed industries
  for (const industry of industries) {
    const record = new Record(industriesCol, {
      id: industry.id,
      name: industry.name,
    });
    dao.saveRecord(record);
  }

  // Seed screen types
  for (const screenType of screenTypes) {
    const record = new Record(screenTypesCol, {
      id: screenType.id,
      name: screenType.name,
    });
    dao.saveRecord(record);
  }

}, (db) => {
  const dao = new Dao(db);

  // Downgrade: clear the seeded data
  const industriesCol = dao.findCollectionByNameOrId("industries");
  const screenTypesCol = dao.findCollectionByNameOrId("screen_types");

  // Delete all industries
  const industries = dao.findRecordsByFilter(industriesCol.id, "1=1");
  for (const record of industries) {
    dao.deleteRecord(record);
  }

  // Delete all screen types
  const screenTypes = dao.findRecordsByFilter(screenTypesCol.id, "1=1");
  for (const record of screenTypes) {
    dao.deleteRecord(record);
  }
});
