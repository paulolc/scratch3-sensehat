PKG=pkg 
MAKESELF=makeself
NODE=node
TARGET_DIR=target
BUILD_DIR=$(TARGET_DIR)/build
MODULES_DIR=node_modules
TARGET=scratch3-sensehat

NODEVERSION=8.16.0
ARCH=armv7
OS=linux
FLAGS=--target node$(NODEVERSION)-$(OS)-$(ARCH) --out-path $(BUILD_DIR)
OUT_FILES = $(BUILD_DIR)/$(TARGET) $(BUILD_DIR)/ioctl.node $(BUILD_DIR)/node_sleep.node $(BUILD_DIR)/NodeIMU.node

node_sleep.node=$(MODULES_DIR)/sleep/build/Release/node_sleep.node
NodeIMU.node=$(MODULES_DIR)/nodeimu/out/NodeIMU.node
ioctl.node=$(MODULES_DIR)/ioctl/build/Release/ioctl.node

EXECUTABLES = $(PKG) $(MAKESELF) $(NODE)
K := $(foreach exec,$(EXECUTABLES),\
        $(if $(shell which $(exec)),some string,$(error "$(exec) is required. No $(exec) found in PATH")))

all: $(TARGET_DIR)/$(TARGET)


$(BUILD_DIR)/$(TARGET): $(node_sleep.node) $(NodeIMU.node) $(ioctl.node)
	$(PKG) . $(FLAGS)


$(node_sleep.node) $(NodeIMU.node) $(ioctl.node):
	npm install



$(BUILD_DIR)/ioctl.node: $(ioctl.node)
$(BUILD_DIR)/node_sleep.node: $(node_sleep.node)
$(BUILD_DIR)/NodeIMU.node: $(NodeIMU.node)

$(BUILD_DIR)/%:
	cp -f $< $@


$(TARGET_DIR)/$(TARGET): $(OUT_FILES)
	makeself $(BUILD_DIR) $(TARGET_DIR)/$(TARGET) $(TARGET) ./$(TARGET)

clean:
	rm -v $(OUT_FILES) $(TARGET_DIR)/$(TARGET); rmdir $(BUILD_DIR) ; rmdir $(TARGET_DIR)
#	rm -rf $(TARGET_DIR)


