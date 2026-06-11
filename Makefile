# overrides to s9pk.mk must precede the include statement
#
# wisp builds from source via the Dockerfile (zig). Built for x86_64 and
# aarch64.
ARCHES := x86 arm

include s9pk.mk
