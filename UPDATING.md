# Updating the upstream version

This package builds wisp from source inside the `Dockerfile`, pinned to an upstream release tag. A bump means pointing the build at a newer tag.

## Determining the upstream version

- **wisp** ([github.com/privkeyio/wisp](https://github.com/privkeyio/wisp/releases)) — list release tags:

  ```
  git ls-remote --tags --sort=-v:refname https://github.com/privkeyio/wisp.git | grep -v '\^{}$' | head
  ```

  The latest release is the highest `v*` tag.

## Applying the bump

1. **`Dockerfile`** — set `ARG WISP_VERSION` to the new tag (e.g. `v0.3.0`) and `ARG WISP_COMMIT` to the commit that tag points to. Resolve it with:

   ```
   git ls-remote https://github.com/privkeyio/wisp.git refs/tags/<tag>^{}
   ```

   Use the dereferenced (`^{}`) commit for annotated tags. The build fails if the clone's HEAD does not match `WISP_COMMIT`.
2. **`startos/versions/current.ts`** — update `version` (`<upstream>:<packaging>`, e.g. `0.3.0:0`) and `releaseNotes`.
3. Rebuild with `make` and confirm the relay starts.

### If the build fails with a dependency `hash mismatch`

`zig build` fails this way when one of wisp's dependencies is fetched from a
moving ref (e.g. `refs/heads/master`) that has since advanced. wisp v0.2.2 and
later pin their dependencies to fixed commits, so this should not happen. If a
future release reintroduces a floating dependency, fix it upstream in wisp's
`build.zig.zon` rather than working around it here.
