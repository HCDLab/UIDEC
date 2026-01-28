/// <reference path="../pb_data/types.d.ts" />

/**
 * Initial schema migration for UIDEC (PocketBase v0.22)
 * Creates all required collections for the application
 */
migrate((db) => {
  const dao = new Dao(db);

  // Create industries collection
  const industries = new Collection({
    id: "yds4b1mad4n9ds5",
    name: "industries",
    type: "base",
    schema: [
      {
        id: "dvray2wj",
        name: "name",
        type: "text",
        required: false,
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });
  dao.saveCollection(industries);

  // Create screen_types collection
  const screenTypes = new Collection({
    id: "pcoicyuvk9dlh1a",
    name: "screen_types",
    type: "base",
    schema: [
      {
        id: "mdso3ijs",
        name: "name",
        type: "text",
        required: false,
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });
  dao.saveCollection(screenTypes);

  // Create logos collection
  const logos = new Collection({
    id: "wvraatyknj6sd77",
    name: "logos",
    type: "base",
    schema: [
      {
        id: "vmvb2dro",
        name: "image",
        type: "file",
        required: false,
        options: {
          mimeTypes: [],
          thumbs: [],
          maxSelect: 1,
          maxSize: 5242880,
          protected: false,
        }
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  dao.saveCollection(logos);

  // Create favorites collection
  const favorites = new Collection({
    id: "f8hks7dpm2zf5t2",
    name: "favorites",
    type: "base",
    schema: [
      {
        id: "jmrhlyau",
        name: "user_id",
        type: "relation",
        required: false,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: [],
        }
      },
      {
        id: "azujd3cg",
        name: "canvas",
        type: "json",
        required: false,
        options: {
          maxSize: 2000000,
        }
      },
      {
        id: "jij9y9bg",
        name: "name",
        type: "text",
        required: false,
      }
    ],
    listRule: "@request.auth.id = user_id",
    viewRule: "@request.auth.id = user_id",
    createRule: "@request.auth.id = user_id",
    updateRule: "@request.auth.id = user_id",
    deleteRule: "@request.auth.id = user_id",
  });
  dao.saveCollection(favorites);

  // Create saved_canvas collection
  const savedCanvas = new Collection({
    id: "kv4a4zt2h0dqs40",
    name: "saved_canvas",
    type: "base",
    schema: [
      {
        id: "jwokzy1a",
        name: "canvas",
        type: "json",
        required: false,
        options: {
          maxSize: 2000000,
        }
      },
      {
        id: "hn64dluy",
        name: "settings",
        type: "json",
        required: false,
        options: {
          maxSize: 2000000,
        }
      },
      {
        id: "4vfzjs1r",
        name: "user_id",
        type: "relation",
        required: false,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: [],
        }
      },
      {
        id: "hgjtzxoj",
        name: "session",
        type: "json",
        required: false,
        options: {
          maxSize: 2000000,
        }
      },
      {
        id: "ikzuznat",
        name: "name",
        type: "text",
        required: false,
      }
    ],
    listRule: "@request.auth.id = user_id",
    viewRule: "@request.auth.id = user_id",
    createRule: "@request.auth.id = user_id",
    updateRule: "@request.auth.id = user_id",
    deleteRule: "@request.auth.id = user_id",
  });
  dao.saveCollection(savedCanvas);

  // Create ui_screens collection
  const uiScreens = new Collection({
    id: "gjkh8d69x1isq5w",
    name: "ui_screens",
    type: "base",
    schema: [
      {
        id: "tp2xpgwt",
        name: "images",
        type: "file",
        required: false,
        options: {
          mimeTypes: [],
          thumbs: [],
          maxSelect: 99,
          maxSize: 5242880,
          protected: false,
        }
      },
      {
        id: "uvdj6u8c",
        name: "screen_type",
        type: "text",
        required: false,
      },
      {
        id: "jcvs56un",
        name: "device",
        type: "text",
        required: false,
      },
      {
        id: "2k6kozad",
        name: "domain",
        type: "text",
        required: false,
      },
      {
        id: "vfbniw2z",
        name: "screen_type_field",
        type: "relation",
        required: false,
        options: {
          collectionId: "pcoicyuvk9dlh1a",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: [],
        }
      },
      {
        id: "2y6yespg",
        name: "domain_field",
        type: "relation",
        required: false,
        options: {
          collectionId: "yds4b1mad4n9ds5",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: [],
        }
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });
  dao.saveCollection(uiScreens);

}, (db) => {
  const dao = new Dao(db);
  // Downgrade: delete collections in reverse order
  const collections = ["ui_screens", "saved_canvas", "favorites", "logos", "screen_types", "industries"];
  for (const name of collections) {
    try {
      const col = dao.findCollectionByNameOrId(name);
      dao.deleteCollection(col);
    } catch (e) {
      // Collection may not exist
    }
  }
});
