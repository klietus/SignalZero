# SignalZero Symbol Browser

A React + TypeScript application built with Vite for exploring and inspecting the **SignalZero Symbol Store**.

This app provides a browser interface to query, navigate, and view details of symbolic structures stored in the external API.

---

## Features

- **Domain & Tag Filtering**: Select a symbol domain and optionally filter by tag.
- **Cursor-based Pagination**: Navigate symbols with Next/Previous buttons using `last_symbol_id`.
- **Symbol List View**:
  - Compact card layout.
  - Header line shows **Domain, Triad, Tag, Topology**.
  - Clickable links to symbol detail pages.
- **Symbol Detail View**:
  - Full metadata display (id, name, triad, role, function, topology, commit).
  - Invariants, invocations, and failure mode.
  - Linked symbols with recursive navigation.
  - Domain and tag links back to filtered list view.

---

## Tech Stack

- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for fast build and dev server.
- [Axios](https://axios-http.com/) for API requests.
- [React Router](https://reactrouter.com/) for navigation.
- [Tailwind CSS](https://tailwindcss.com/) for styling.

---

## Getting Started

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the local dev server with hot reload.

### Build

```bash
npm run build
```

Builds for production.

### Preview

```bash
npm run preview
```

Serves the production build locally.

---

## API

The app connects to the **SignalZero Symbol API**:

- `GET /domains` → list of symbol domains
- `GET /symbol` → query symbols by domain/tag with pagination (`limit`, `last_symbol_id`, `direction`)
- `GET /symbol/:id` → fetch full details for a symbol

---

## Project Structure

```
src/
  components/
    SymbolList.tsx     # Symbol list with filters and pagination
    SymbolDetail.tsx   # Symbol detail with metadata and linked navigation
  main.tsx            # App entry
  App.tsx             # Router setup
```

---

## Roadmap

- [ ] Add search across names and macros.
- [ ] Add visual triad/role badges.
- [ ] Support infinite scroll.
- [ ] Enhance linked symbol graph visualization.

---

## License

MIT
