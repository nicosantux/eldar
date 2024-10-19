# eldar

To see the deployed version of the project, go to [eldar.vercel.app](https://eldar-swart.vercel.app).

## Run locally

Clone the repository:

```sh
git clone git@github.com:nicosantux/eldar.git
```

Install dependencies:

> [!IMPORTANT]
> You need to have [pnpm](https://pnpm.io/) installed. Run `npm install -g pnpm` to install it.

```sh
cd eldar && pnpm install
```

Rename `.env.development.local.example` to `.env.development.local` and fill the required environment variables. These variables are used to connect to vercel postgres database and handle authentication.

Start the development server:

```sh
pnpm dev:vercel
```

## Deploy

In the deployed version, you can use the following accounts to log in:

| Email                   | Password     |
| ----------------------- | ------------ |
| `eldar.user@gmail.com`  | `eldaruser`  |
| `eldar.admin@gmail.com` | `eldaradmin` |

Or you can create a new account with user role.
