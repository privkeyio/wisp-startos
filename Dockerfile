FROM docker.io/library/debian:bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    xz-utils \
    git \
    ca-certificates \
    liblmdb-dev \
    libsecp256k1-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

ARG TARGETARCH
ARG ZIG_VERSION=0.17.0
RUN case "${TARGETARCH}" in \
        amd64) ZIG_ARCH="x86_64"; ZIG_SHA="1cbe9df9f27e6b78d14ccbca43b6703a404ef79ef1c463de901d7f088d4e2026" ;; \
        arm64) ZIG_ARCH="aarch64"; ZIG_SHA="9e8d11661d4ae3bd57702a3832781e23ad151dde5798e16a5ccd503f65234ff8" ;; \
        *) echo "Unsupported architecture: ${TARGETARCH}" && exit 1 ;; \
    esac && \
    curl -fsSL -o zig.tar.xz "https://ziglang.org/download/${ZIG_VERSION}/zig-${ZIG_ARCH}-linux-${ZIG_VERSION}.tar.xz" && \
    echo "${ZIG_SHA}  zig.tar.xz" | sha256sum -c - && \
    tar -xJ -C /usr/local -f zig.tar.xz && \
    rm zig.tar.xz && \
    ln -s /usr/local/zig-${ZIG_ARCH}-linux-${ZIG_VERSION}/zig /usr/local/bin/zig

# Pinned to the latest upstream release. Bump WISP_VERSION and WISP_COMMIT to
# update (see UPDATING.md). WISP_COMMIT is the immutable commit the tag points
# to; the guard below fails the build if the tag is ever re-pointed.
ARG WISP_VERSION=v0.8.0
ARG WISP_COMMIT=687faf8e5c9e7a113433fead1497dac2b4735c9a
RUN git clone --branch ${WISP_VERSION} --depth 1 https://github.com/privkeyio/wisp.git /src && \
    HEAD_SHA="$(git -C /src rev-parse HEAD)" && \
    if [ "${HEAD_SHA}" != "${WISP_COMMIT}" ]; then \
        echo "wisp ${WISP_VERSION} commit mismatch: expected ${WISP_COMMIT}, got ${HEAD_SHA}" && exit 1; \
    fi

WORKDIR /src
# -Dcpu=baseline restricts codegen to the architecture's baseline ISA so the
# binary runs on any x86_64/aarch64 CPU. Without it, zig targets the build
# host's native CPU and the binary crashes with SIGILL on older/different CPUs.
RUN zig build -Doptimize=ReleaseSafe -Dcpu=baseline

FROM docker.io/library/debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    liblmdb0 \
    libsecp256k1-1 \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /src/zig-out/bin/wisp /usr/local/bin/wisp

RUN mkdir -p /app /data

WORKDIR /app

EXPOSE 7777
