FROM docker.io/library/debian:bookworm-slim AS builder

RUN apt-get update && apt-get install -y \
    curl \
    xz-utils \
    git \
    liblmdb-dev \
    libsecp256k1-dev \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ARG TARGETARCH
ARG ZIG_VERSION=0.15.2
RUN case "${TARGETARCH}" in \
        amd64) ZIG_ARCH="x86_64" ;; \
        arm64) ZIG_ARCH="aarch64" ;; \
        *) echo "Unsupported architecture: ${TARGETARCH}" && exit 1 ;; \
    esac && \
    curl -L "https://ziglang.org/download/${ZIG_VERSION}/zig-${ZIG_ARCH}-linux-${ZIG_VERSION}.tar.xz" | tar -xJ -C /usr/local && \
    ln -s /usr/local/zig-${ZIG_ARCH}-linux-${ZIG_VERSION}/zig /usr/local/bin/zig

WORKDIR /build

RUN git clone --branch v0.1.13 --depth 1 https://github.com/VnUgE/noscrypt.git /build/noscrypt

COPY ./noscrypt-zig/build.zig /build/noscrypt/build.zig
COPY ./noscrypt-zig/build.zig.zon /build/noscrypt/build.zig.zon

COPY ./wisp /build/wisp

WORKDIR /build/wisp
RUN zig build -Doptimize=ReleaseFast

FROM docker.io/library/debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    liblmdb0 \
    libsecp256k1-1 \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV APP_USER=wisp
RUN groupadd $APP_USER && useradd -g $APP_USER $APP_USER

RUN mkdir -p /app /data && chown -R $APP_USER:$APP_USER /app /data

COPY --from=builder /build/wisp/zig-out/bin/wisp /app/wisp

COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod +x /usr/local/bin/docker_entrypoint.sh

WORKDIR /app

EXPOSE 7777

ENV WISP_HOST=0.0.0.0
ENV WISP_PORT=7777
ENV WISP_STORAGE_PATH=/data
