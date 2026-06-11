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
ARG ZIG_VERSION=0.15.2
RUN case "${TARGETARCH}" in \
        amd64) ZIG_ARCH="x86_64" ;; \
        arm64) ZIG_ARCH="aarch64" ;; \
        *) echo "Unsupported architecture: ${TARGETARCH}" && exit 1 ;; \
    esac && \
    curl -fsSL "https://ziglang.org/download/${ZIG_VERSION}/zig-${ZIG_ARCH}-linux-${ZIG_VERSION}.tar.xz" | tar -xJ -C /usr/local && \
    ln -s /usr/local/zig-${ZIG_ARCH}-linux-${ZIG_VERSION}/zig /usr/local/bin/zig

# Pinned to the latest upstream release. Bump WISP_VERSION to update (see UPDATING.md).
ARG WISP_VERSION=v0.2.2
RUN git clone --branch ${WISP_VERSION} --depth 1 https://github.com/privkeyio/wisp.git /src

WORKDIR /src
RUN zig build -Doptimize=ReleaseFast

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
