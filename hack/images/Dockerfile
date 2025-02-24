# Start with an official Ubuntu base image
FROM ubuntu:20.04

# Set non-interactive mode to avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages and tools
RUN apt-get update && apt-get install -y \
  bash \
  curl \
  wget \
  git \
  ca-certificates \
  lsb-release \
  sudo \
  tini \
  libjson-c-dev \
  libwebsockets-dev \
  cmake \
  make \
  && rm -rf /var/lib/apt/lists/*


# Install ttyd by cloning the repo and building from source
RUN git clone https://github.com/tsl0922/ttyd.git /ttyd && \
    cd /ttyd && \
    mkdir build && \
    cd build && \
    cmake .. && \
    make && \
    make install

# Add a user to run ttyd as non-root (optional but recommended for security)
RUN useradd -m ttyduser

# Set the working directory
WORKDIR /home/ttyduser

# Expose the port ttyd will use
EXPOSE 7681

# Use tini to handle the ttyd process and ensure proper shutdown
ENTRYPOINT ["/usr/bin/tini", "--"]

# Switch to the ttyduser for running ttyd
USER ttyduser

# Command to run ttyd and start the web terminal
CMD ["ttyd", "-W", "bash"]

