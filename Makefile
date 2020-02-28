# PKG . --target node8.16.0-linux-armv7
# makeself . scratch3-sensehat.run scratch3-sensehat ./scratch3-sensehat


PKG=pkg 
MAKESELF=makeself
TARGET_DIR=target
BUILD_DIR=$(BUILD_DIR)/build
MODULES_DIR=node_modules
BIN=scratch3-sensehat

NODEVERSION=8.16.0
ARCH=armv7
OS=linux
FLAGS=--target node$(NODEVERSION)-$(OS)-$(ARCH) --out-path $(BUILD_DIR)

node_sleep.node=$(MODULES_DIR)/sleep/build/Release/node_sleep.node
NodeIMU.node=$(MODULES_DIR)/nodeimu/out/NodeIMU.node
ioctl.node=$(MODULES_DIR)/ioctl/build/Release/ioctl.node

EXECUTABLES = $(PKG) $(MAKESELF)
K := $(foreach exec,$(EXECUTABLES),\
        $(if $(shell which $(exec)),some string,$(error "$(exec) is required. No $(exec) found in PATH")))


all: scratch3-sensehat

$(node_sleep.node), $(NodeIMU.node):
	npm install

$(TARGET_DIR)/scratch3-sensehat:
	$(PKG) . $(FLAGS)

$(BUILD_DIR)/ioctl.node: $(ioctl.node)
$(BUILD_DIR)/node_sleep.node: $(node_sleep.node)
$(BUILD_DIR)/NodeIMU.node: $(NodeIMU.node)
$(BUILD_DIR)/scratch3-sensehat: $(TARGET_DIR)/scratch3-sensehat

$(BUILD_DIR)/%:
    cp -f $< $@

clean:
	rm -rf $(TARGET_DIR)

scratch3-sensehat: $(BUILD_DIR)/*
	makeself $(TARGET_DIR) scratch3-sensehat.run scratch3-sensehat ./scratch3-sensehat

