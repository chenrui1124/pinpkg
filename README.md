# pinpkg

A CLI tool to install packages from predefined stores in your project.

## Why

When you frequently scaffold projects using the same set of packages (e.g. `react` + `react-dom` + `typescript` + `vite`), typing them out one by one gets old. **pinpkg** lets you define reusable groups of packages and install them with a single command.

## Install

```bash
npm i -g pinpkg
```

## Commands

### `pinpkg` / `pinpkg use`

Select one or more package groups and install their packages into the current project.

```bash
pinpkg
```

You'll be prompted to choose groups and a package manager (npm, yarn, pnpm, or bun). The install command is then shown and can be edited before execution.

### `pinpkg group add`

Create a new package group.

```bash
pinpkg group add
```

Package spec format:

```
name[@version][#D]
```

| Part       | Required | Example          |
| ---------- | -------- | ---------------- |
| `name`     | Yes      | `react`          |
| `@version` | No       | `react@18`       |
| `#D`       | No       | `@types/react#D` |

Append `#D` to mark a package as a devDependency. Separate multiple specs with spaces.

### `pinpkg group list` (alias: `ls`)

List all package groups.

### `pinpkg group remove` (alias: `rm`)

Remove one or more package groups.

### `pinpkg config edit`

Open the config file (`~/.pinpkg/config.json`) in your preferred editor.

### `pinpkg restore`

Restore the config file to its initial state.

## Config

Config is stored at `~/.pinpkg/config.json`:

```json
{
  "groups": [
    {
      "name": "react-starter",
      "packages": ["react", "react-dom", "@types/react#D", "@types/react-dom#D"]
    }
  ]
}
```

## License

MIT
