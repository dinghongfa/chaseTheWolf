System.register("chunks:///_virtual/BtnSwtich.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameSound.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Node, NodeEventType, Component, GameSound;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      NodeEventType = module.NodeEventType;
      Component = module.Component;
    }, function (module) {
      GameSound = module.GameSound;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "ba36dfRR8hL3qlwiXF2J4Mv", "BtnSwtich", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var BtnSwtich = exports('BtnSwtich', (_dec = ccclass('BtnSwtich'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BtnSwtich, _Component);
        function BtnSwtich() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "m_spriteOpen", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_spriteClose", _descriptor2, _assertThisInitialized(_this));
          _this.m_isSwitched = true;
          _this.m_cb = null;
          return _this;
        }
        var _proto = BtnSwtich.prototype;
        _proto.onEnable = function onEnable() {
          this.node.on(NodeEventType.TOUCH_END, this["switch"], this);
        };
        _proto.onDisable = function onDisable() {
          this.node.off(NodeEventType.TOUCH_END, this["switch"], this);
        };
        _proto["switch"] = function _switch() {
          if (this.m_isSwitched == true) {
            this.isSwitched = false;
          } else {
            this.isSwitched = true;
          }
          GameSound.getInstance().playEffect('click');
          this.m_cb && this.m_cb(this.isSwitched);
        };
        _proto.setChangeCB = function setChangeCB(callback) {
          this.m_cb = callback;
          // this.node.on(NodeEventType.TOUCH_END, callback, this);
        };

        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {};
        _createClass(BtnSwtich, [{
          key: "isSwitched",
          get: function get() {
            return this.m_isSwitched;
          },
          set: function set(value) {
            this.m_isSwitched = value;
            if (this.m_isSwitched == true) {
              this.m_spriteOpen.active = true;
              this.m_spriteClose.active = false;
            } else {
              this.m_spriteOpen.active = false;
              this.m_spriteClose.active = true;
            }
          }
        }]);
        return BtnSwtich;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "m_spriteOpen", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "m_spriteClose", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resources", ['./BtnSwtich.ts', './SettingView.ts'], function () {
  return {
    setters: [null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/SettingView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BtnSwtich.ts', './StorageManager.ts', './PopupBase.ts', './AudioEngine.ts', './GameSound.ts', './MessageManager.ts', './GameEvent.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Button, BtnSwtich, StorageManager, PopupBase, AudioEngine, GameSound, message, GameEventEnum;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Button = module.Button;
    }, function (module) {
      BtnSwtich = module.BtnSwtich;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      PopupBase = module.PopupBase;
    }, function (module) {
      AudioEngine = module.AudioEngine;
    }, function (module) {
      GameSound = module.GameSound;
    }, function (module) {
      message = module.message;
    }, function (module) {
      GameEventEnum = module.GameEventEnum;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "4a4f7VkXbtAgIp7Bb9WUWBF", "SettingView", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var SettingView = exports('SettingView', (_dec = ccclass('SettingView'), _dec2 = property(BtnSwtich), _dec3 = property(BtnSwtich), _dec4 = property(BtnSwtich), _dec5 = property(Button), _dec(_class = (_class2 = /*#__PURE__*/function (_PopupBase) {
        _inheritsLoose(SettingView, _PopupBase);
        function SettingView() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _PopupBase.call.apply(_PopupBase, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "btnEffect", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "btnMusic", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "btnShake", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "btnClose", _descriptor4, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = SettingView.prototype;
        _proto.onLoad = function onLoad() {
          _PopupBase.prototype.onLoad.call(this);
          this.btnClose.node.on(Button.EventType.CLICK, this.onClose, this);
          this.btnEffect.isSwitched = AudioEngine.getInstance().getAllEffectsVolume() > 0;
          this.btnMusic.isSwitched = AudioEngine.getInstance().getMusicVolume() > 0;
          this.btnShake.isSwitched = StorageManager.ins.getNumber("isShakeOpen", 1) === 1;
          this.btnEffect.setChangeCB(function (value) {
            StorageManager.ins.set("isEffectOpen", value ? 1 : 0);
            AudioEngine.getInstance().setAllEffectsVolume(value ? 1 : 0);
          });
          this.btnMusic.setChangeCB(function (value) {
            StorageManager.ins.set("isMusicOpen", value ? 1 : 0);
            AudioEngine.getInstance().setMusicVolume(value ? 1 : 0);
          });
          this.btnShake.setChangeCB(function (value) {
            StorageManager.ins.set("isShakeOpen", value ? 1 : 0);
          });
        };
        _proto.onClose = function onClose() {
          GameSound.getInstance().playEffect('click');
          this.node.active = false;
        };
        _proto.onEnable = function onEnable() {
          // message.on(GameEventEnum.PAUSED, this.pauseGame, this)
          message.dispatchEvent(GameEventEnum.PAUSED, true);
        };
        _proto.onDisable = function onDisable() {
          message.dispatchEvent(GameEventEnum.PAUSED, false);
        };
        return SettingView;
      }(PopupBase), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btnEffect", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnMusic", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "btnShake", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "btnClose", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/resources', 'chunks:///_virtual/resources'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});