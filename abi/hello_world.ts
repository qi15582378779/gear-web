export type HelloWorld = {
  "version": "0.1.0",
  "name": "hello_world",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "helloWorld",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "string"
        }
      ]
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "helloWorld",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "helloWorld",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "data",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "CannotGetBump",
      "msg": "Cannot get the bump."
    }
  ]
};

export const IDL: HelloWorld = {
  "version": "0.1.0",
  "name": "hello_world",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "helloWorld",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "string"
        }
      ]
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "helloWorld",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "helloWorld",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "data",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "CannotGetBump",
      "msg": "Cannot get the bump."
    }
  ]
};
