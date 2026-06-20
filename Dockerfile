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
ARG ZIG_VERSION=0.16.0
RUN case "${TARGETARCH}" in \
        amd64) ZIG_ARCH="x86_64"; ZIG_SHA="70e49664a74374b48b51e6f3fdfbf437f6395d42509050588bd49abe52ba3d00" ;; \
        arm64) ZIG_ARCH="aarch64"; ZIG_SHA="ea4b09bfb22ec6f6c6ceac57ab63efb6b46e17ab08d21f69f3a48b38e1534f17" ;; \
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
ARG WISP_VERSION=v0.5.4
ARG WISP_COMMIT=c811d1cd83a65549062c7a37c45468845794fe3b
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
