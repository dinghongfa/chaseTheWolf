System.register("chunks:///_virtual/AsyncQueue.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createClass, cclegacy, warn, log;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      warn = module.warn;
      log = module.log;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ecd789BOLtB5rDcGgz3iAWs", "AsyncQueue", undefined);
      /**
       * 异步队列处理
       * @example
      var queue: AsyncQueue = new AsyncQueue();
      queue.push((next: NextFunction, params: any, args: any) => {
          oops.res.load("language/font/" + oops.language.current, next);
      });
      queue.push((next: NextFunction, params: any, args: any) => {
          oops.res.loadDir("common", next);
      });
      queue.complete =  () => {
          console.log("处理完成");
      };
      queue.play();
       */
      var AsyncQueue = exports('AsyncQueue', /*#__PURE__*/function () {
        function AsyncQueue() {
          // 正在运行的任务
          this._runningAsyncTask = null;
          this._queues = [];
          // 正在执行的异步任务标识
          this._isProcessingTaskUUID = 0;
          this._enable = true;
          /**
           * 任务队列完成回调
           */
          this.complete = null;
        }
        var _proto = AsyncQueue.prototype;
        /**
         * 添加一个异步任务到队列中
         * @param callback  回调
         * @param params    参数
         */
        _proto.push = function push(callback, params) {
          if (params === void 0) {
            params = null;
          }
          var uuid = AsyncQueue._$uuid_count++;
          this._queues.push({
            uuid: uuid,
            callbacks: [callback],
            params: params
          });
          return uuid;
        }

        /**
         * 添加多个任务，多个任务函数会同时执行
         * @param params     参数据
         * @param callbacks  回调
         * @returns 
         */;
        _proto.pushMulti = function pushMulti(params) {
          var uuid = AsyncQueue._$uuid_count++;
          for (var _len = arguments.length, callbacks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            callbacks[_key - 1] = arguments[_key];
          }
          this._queues.push({
            uuid: uuid,
            callbacks: callbacks,
            params: params
          });
          return uuid;
        }

        /**
         * 移除一个还未执行的异步任务
         * @param uuid  任务唯一编号
         */;
        _proto.remove = function remove(uuid) {
          var _this$_runningAsyncTa;
          if (((_this$_runningAsyncTa = this._runningAsyncTask) == null ? void 0 : _this$_runningAsyncTa.uuid) === uuid) {
            warn("正在执行的任务不可以移除");
            return;
          }
          for (var i = 0; i < this._queues.length; i++) {
            if (this._queues[i].uuid === uuid) {
              this._queues.splice(i, 1);
              break;
            }
          }
        }

        /** 队列长度 */;
        /** 清空队列 */
        _proto.clear = function clear() {
          this._queues = [];
          this._isProcessingTaskUUID = 0;
          this._runningAsyncTask = null;
        }

        /** 跳过当前正在执行的任务 */;
        _proto.step = function step() {
          if (this.isProcessing) {
            this.next(this._isProcessingTaskUUID);
          }
        }

        /**
         * 开始运行队列
         * @param args  参数
         */;
        _proto.play = function play(args) {
          var _this = this;
          if (args === void 0) {
            args = null;
          }
          if (this.isProcessing) {
            return;
          }
          if (!this._enable) {
            return;
          }
          var actionData = this._queues.shift();
          if (actionData) {
            this._runningAsyncTask = actionData;
            var taskUUID = actionData.uuid;
            this._isProcessingTaskUUID = taskUUID;
            var callbacks = actionData.callbacks;
            if (callbacks.length == 1) {
              var nextFunc = function nextFunc(nextArgs) {
                if (nextArgs === void 0) {
                  nextArgs = null;
                }
                _this.next(taskUUID, nextArgs);
              };
              callbacks[0](nextFunc, actionData.params, args);
            } else {
              // 多个任务函数同时执行
              var fnum = callbacks.length;
              var nextArgsArr = [];
              var _nextFunc = function _nextFunc(nextArgs) {
                if (nextArgs === void 0) {
                  nextArgs = null;
                }
                --fnum;
                nextArgsArr.push(nextArgs || null);
                if (fnum === 0) {
                  _this.next(taskUUID, nextArgsArr);
                }
              };
              var knum = fnum;
              for (var i = 0; i < knum; i++) {
                callbacks[i](_nextFunc, actionData.params, args);
              }
            }
          } else {
            this._isProcessingTaskUUID = 0;
            this._runningAsyncTask = null;
            if (this.complete) {
              this.complete(args);
            }
          }
        }

        /**
         * 往队列中push一个延时任务
         * @param time 毫秒时间
         * @param callback （可选参数）时间到了之后回调
         */;
        _proto.yieldTime = function yieldTime(time, callback) {
          if (callback === void 0) {
            callback = null;
          }
          var task = function task(next, params, args) {
            var _t = setTimeout(function () {
              clearTimeout(_t);
              if (callback) {
                callback();
              }
              next(args);
            }, time);
          };
          this.push(task, {
            des: "AsyncQueue.yieldTime"
          });
        };
        _proto.next = function next(taskUUID, args) {
          if (args === void 0) {
            args = null;
          }
          if (this._isProcessingTaskUUID === taskUUID) {
            this._isProcessingTaskUUID = 0;
            this._runningAsyncTask = null;
            this.play(args);
          } else {
            if (this._runningAsyncTask) {
              log(this._runningAsyncTask);
            }
          }
        }

        /**
         * 返回一个执行函数，执行函数调用count次后，next将触发
         * @param count 
         * @param next 
         * @return 返回一个匿名函数
         */;
        AsyncQueue.excuteTimes = function excuteTimes(count, next) {
          if (next === void 0) {
            next = null;
          }
          var fnum = count;
          var call = function call() {
            --fnum;
            if (fnum === 0) {
              next && next();
            }
          };
          return call;
        };
        _createClass(AsyncQueue, [{
          key: "queues",
          get: /** 任务队列 */
          function get() {
            return this._queues;
          }
        }, {
          key: "enable",
          get: /** 是否开启可用 */
          function get() {
            return this._enable;
          }
          /** 是否开启可用 */,
          set: function set(val) {
            if (this._enable === val) {
              return;
            }
            this._enable = val;
            if (val && this.size > 0) {
              this.play();
            }
          }
        }, {
          key: "size",
          get: function get() {
            return this._queues.length;
          }

          /** 是否有正在处理的任务 */
        }, {
          key: "isProcessing",
          get: function get() {
            return this._isProcessingTaskUUID > 0;
          }

          /** 队列是否已停止 */
        }, {
          key: "isStop",
          get: function get() {
            if (this._queues.length > 0) {
              return false;
            }
            if (this.isProcessing) {
              return false;
            }
            return true;
          }

          /** 正在执行的任务参数 */
        }, {
          key: "runningParams",
          get: function get() {
            if (this._runningAsyncTask) {
              return this._runningAsyncTask.params;
            }
            return null;
          }
        }]);
        return AsyncQueue;
      }());
      // 任务task的唯一标识
      AsyncQueue._$uuid_count = 1;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Audio.ts", ['cc'], function (exports) {
  var cclegacy, AudioSource, Node;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      AudioSource = module.AudioSource;
      Node = module.Node;
    }],
    execute: function () {
      cclegacy._RF.push({}, "98fd57P3f5Pk6eDeq1udY5q", "Audio", undefined);
      var Audio = exports('Audio', /*#__PURE__*/function () {
        function Audio() {
          this.volume = 1;
          // private volumeScale: number = 1;
          this.mute = false;
          this.endedCallback = null;
          this.startedCallback = null;
          this.paused = false;
          this.audioSource = null;
          var node = new Node('audio');
          this.audioSource = node.addComponent(AudioSource);
          node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
          node.on(AudioSource.EventType.STARTED, this.onAudioStarted, this);
        }
        var _proto = Audio.prototype;
        _proto.onAudioEnded = function onAudioEnded() {
          if (this.endedCallback) {
            var callback = this.endedCallback;
            this.endedCallback = null;
            callback();
          }
        };
        _proto.onAudioStarted = function onAudioStarted() {
          if (this.startedCallback) {
            var callback = this.startedCallback;
            this.startedCallback = null;
            callback();
          }
        };
        _proto.play = function play(clip, onEnded, onStarted) {
          if (!this.audioSource) return this;
          this.audioSource.clip = clip;
          this.endedCallback = onEnded || null;
          this.startedCallback = onStarted || null;
          this.audioSource.volume = this.volume;
          this.audioSource.play();
          return this;
        };
        _proto.stop = function stop() {
          if (!this.audioSource) return this;
          this.audioSource.stop();
          this.audioSource.node.emit(AudioSource.EventType.ENDED);
          return this;
        };
        _proto.pause = function pause() {
          if (!this.audioSource) return this;
          this.paused = true;
          this.audioSource.pause();
          return this;
        };
        _proto.resume = function resume() {
          if (!this.audioSource) return this;
          if (this.paused) {
            this.paused = false;
            this.audioSource.play();
          }
          return this;
        };
        _proto.setVolume = function setVolume(volume) {
          if (volume === void 0) {
            volume = 1;
          }
          if (!this.audioSource) return this;
          this.volume = volume;
          this.audioSource.volume = volume;
          return this;
        };
        _proto.getVolume = function getVolume() {
          return this.volume;
        };
        _proto.setLoop = function setLoop(loop) {
          if (!this.audioSource) return this;
          this.audioSource.loop = loop;
          return this;
        };
        _proto.getLoop = function getLoop() {
          var _this$audioSource;
          return ((_this$audioSource = this.audioSource) == null ? void 0 : _this$audioSource.loop) || false;
        };
        _proto.setMute = function setMute(mute) {
          if (mute === void 0) {
            mute = true;
          }
          this.mute = mute;
          this.setVolume(this.volume);
          return this;
        };
        _proto.getMute = function getMute() {
          return this.mute;
        };
        _proto.onEnded = function onEnded(endedCallback) {
          this.endedCallback = endedCallback;
          return this;
        }

        /**
         * 获取当前播放状态
         */;
        _proto.isPlaying = function isPlaying() {
          var _this$audioSource2;
          return ((_this$audioSource2 = this.audioSource) == null ? void 0 : _this$audioSource2.playing) || false;
        }

        /**
         * 获取当前暂停状态
         */;
        _proto.isPaused = function isPaused() {
          return this.paused;
        };
        _proto.clear = function clear() {
          this.volume = 1;
          this.mute = false;
          this.paused = false;
          this.endedCallback = null;
          this.startedCallback = null;
          if (this.audioSource) {
            this.audioSource.stop();
            this.audioSource.volume = 1;
            this.audioSource.clip = null;
            this.audioSource.loop = false;
          }
          return this;
        };
        _proto.destroy = function destroy() {
          if (!this.audioSource) return;
          this.clear();
          this.audioSource.node.off(AudioSource.EventType.ENDED, this.onAudioEnded, this);
          this.audioSource.node.off(AudioSource.EventType.STARTED, this.onAudioStarted, this);
          this.audioSource.destroy();
          this.audioSource.node.destroy();
          this.audioSource = null;
        };
        return Audio;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioEngine.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts', './SingtonClass.ts', './StorageManager.ts', './Logger.ts'], function (exports) {
  var _inheritsLoose, cclegacy, AudioManager, SingletonMgr, StorageManager, Logger;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      SingletonMgr = module.SingletonMgr;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      Logger = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "84dc1hNugVHJqne7hAtbtUj", "AudioEngine", undefined);

      /**
       * 音频引擎
       * 统一管理音乐和音效的播放
       */
      var AudioEngine = exports('AudioEngine', /*#__PURE__*/function (_SingletonMgr) {
        _inheritsLoose(AudioEngine, _SingletonMgr);
        function AudioEngine() {
          var _this;
          _this = _SingletonMgr.call(this) || this;
          /** effect 的 id 从 1 开始，music 的 id 始终为 0 */
          _this.audioID = 1;
          _this.endedCallbackMap = new Map();
          _this.effectMap = new Map();
          _this.music = null;
          _this.musicMute = false;
          _this.effectMute = false;
          _this.musicVolume = 1;
          _this.musicVolumeScale = 1;
          _this.effectVolume = 1;
          _this.effectVolumeScale = 1;
          _this.musicVolume = StorageManager.ins.getNumber("isMusicOpen", 1);
          _this.effectVolume = StorageManager.ins.getNumber("isEffectOpen", 1);
          Logger.log("AudioEngine", "musicVolume", _this.musicVolume, "effectVolume", _this.effectVolume);
          return _this;
        }

        ////////////////////////////////
        // 音效                        //
        ////////////////////////////////
        /**
         * 播放音效
         * @param audioClip 音频片段
         * @param volume 音量 (0-1)
         * @param loop 是否循环
         * @param onStarted 开始播放回调
         * @param onEnded 播放结束回调
         * @returns 音效 ID
         */
        var _proto = AudioEngine.prototype;
        _proto.playEffect = function playEffect(audioClip, loop, onStarted, onEnded) {
          var _this2 = this;
          if (loop === void 0) {
            loop = false;
          }
          if (this.audioID > 100000) {
            this.audioID = 1;
          }
          var audioID = this.audioID++;
          var audio = AudioManager.getInstance().getAudio();
          this.effectMap.set(audioID, audio);
          if (onEnded) {
            this.endedCallbackMap.set(audioID, onEnded);
          }
          if (this.effectVolume == 0) {
            return audioID;
          }
          audio.setLoop(loop).setMute(this.effectMute).setVolume(this.effectVolume).play(audioClip, function () {
            // 播放结束
            AudioManager.getInstance().putAudio(audio);
            _this2.effectMap["delete"](audioID);
            var callback = _this2.endedCallbackMap.get(audioID);
            if (callback) {
              _this2.endedCallbackMap["delete"](audioID);
              callback();
            }
          }, function () {
            // 开始播放
            onStarted == null || onStarted(audioID);
          });
          return audioID;
        };
        _proto.stopEffect = function stopEffect(id) {
          var audio = this.effectMap.get(id);
          if (audio) {
            audio.stop();
            return true;
          }
          return false;
        };
        _proto.stopAllEffects = function stopAllEffects() {
          this.effectMap.forEach(function (audio) {
            return audio.stop();
          });
        };
        _proto.pauseEffect = function pauseEffect(id) {
          var audio = this.effectMap.get(id);
          if (audio) {
            audio.pause();
            return true;
          }
          return false;
        };
        _proto.pauseAllEffects = function pauseAllEffects() {
          this.effectMap.forEach(function (audio) {
            return audio.pause();
          });
        };
        _proto.resumeEffect = function resumeEffect(id) {
          var audio = this.effectMap.get(id);
          if (audio) {
            audio.resume();
            return true;
          }
          return false;
        };
        _proto.resumeAllEffects = function resumeAllEffects() {
          this.effectMap.forEach(function (audio) {
            return audio.resume();
          });
        };
        _proto.setEffectMute = function setEffectMute(id, mute) {
          var audio = this.effectMap.get(id);
          if (audio) {
            audio.setMute(mute);
            return true;
          }
          return false;
        };
        _proto.setAllEffectsMute = function setAllEffectsMute(mute) {
          this.effectMute = mute;
          this.effectMap.forEach(function (audio) {
            return audio.setMute(mute);
          });
        };
        _proto.getEffectMute = function getEffectMute(id) {
          var _this$effectMap$get;
          return ((_this$effectMap$get = this.effectMap.get(id)) == null ? void 0 : _this$effectMap$get.getMute()) || false;
        };
        _proto.getAllEffectsMute = function getAllEffectsMute() {
          return this.effectMute;
        };
        _proto.setEffectVolume = function setEffectVolume(id, volume) {
          var audio = this.effectMap.get(id);
          if (audio) {
            audio.setVolume(volume);
            return true;
          }
          return false;
        };
        _proto.setAllEffectsVolume = function setAllEffectsVolume(volume) {
          this.effectVolume = volume;
          this.effectMap.forEach(function (audio) {
            return audio.setVolume(volume);
          });
        };
        _proto.getEffectVolume = function getEffectVolume(id) {
          var _this$effectMap$get2;
          return ((_this$effectMap$get2 = this.effectMap.get(id)) == null ? void 0 : _this$effectMap$get2.getVolume()) || 0;
        };
        _proto.getAllEffectsVolume = function getAllEffectsVolume() {
          return this.effectVolume;
        };
        _proto.getAllEffectsVolumeScale = function getAllEffectsVolumeScale() {
          return this.effectVolumeScale;
        }

        /**
         * 获取当前播放的音效数量
         */;
        _proto.getEffectCount = function getEffectCount() {
          return this.effectMap.size;
        }

        ////////////////////////////////
        // 音乐                        //
        ////////////////////////////////
        /**
         * 播放背景音乐
         * @param audioClip 音频片段
         * @param volume 音量 (0-1)
         * @param onStarted 开始播放回调
         * @returns 音乐 ID (始终为 0)
         */;
        _proto.playMusic = function playMusic(audioClip, onStarted) {
          if (this.music) {
            this.music.destroy();
          }
          // debugger
          Logger.log("playMusic", this.musicVolume);
          this.music = AudioManager.getInstance().getAudio();
          this.music.setLoop(true).setVolume(this.musicVolume).play(audioClip, null, onStarted);
          return 0;
        };
        _proto.stopMusic = function stopMusic() {
          if (this.music) {
            this.music.stop();
            return true;
          }
          return false;
        };
        _proto.pauseMusic = function pauseMusic() {
          if (this.music) {
            this.music.pause();
            return true;
          }
          return false;
        };
        _proto.resumeMusic = function resumeMusic() {
          if (this.music) {
            this.music.resume();
            return true;
          }
          return false;
        };
        _proto.setMusicMute = function setMusicMute(mute) {
          this.musicMute = mute;
          if (this.music) {
            this.music.setMute(mute);
            return true;
          }
          return false;
        };
        _proto.getMusicMute = function getMusicMute() {
          return this.musicMute;
        };
        _proto.setMusicVolume = function setMusicVolume(volume) {
          this.musicVolume = volume;
          if (this.music) {
            this.music.setVolume(volume);
            return true;
          }
          return false;
        };
        _proto.getMusicVolume = function getMusicVolume() {
          return this.musicVolume;
        };
        _proto.getMusicVolumeScale = function getMusicVolumeScale() {
          return this.musicVolumeScale;
        }

        /**
         * 检查音乐是否正在播放
         */;
        _proto.isMusicPlaying = function isMusicPlaying() {
          var _this$music;
          return ((_this$music = this.music) == null ? void 0 : _this$music.isPlaying()) || false;
        }

        ////////////////////////////////
        // 通用                        //
        ////////////////////////////////
        /**
         * 设置播放结束回调
         * @param audioID 音频 ID (0 为音乐，其他为音效)
         * @param callback 回调函数
         */;
        _proto.setEndedCallback = function setEndedCallback(audioID, callback) {
          if (audioID === 0) {
            if (this.music) {
              this.music.onEnded(callback);
              return true;
            }
            return false;
          } else {
            if (this.effectMap.has(audioID)) {
              this.endedCallbackMap.set(audioID, callback);
              return true;
            }
            return false;
          }
        };
        _proto.stop = function stop(audioID) {
          return audioID === 0 ? this.stopMusic() : this.stopEffect(audioID);
        };
        _proto.pause = function pause(audioID) {
          return audioID === 0 ? this.pauseMusic() : this.pauseEffect(audioID);
        };
        _proto.resume = function resume(audioID) {
          return audioID === 0 ? this.resumeMusic() : this.resumeEffect(audioID);
        };
        _proto.pauseAll = function pauseAll() {
          this.pauseMusic();
          this.pauseAllEffects();
        };
        _proto.resumeAll = function resumeAll() {
          this.resumeMusic();
          this.resumeAllEffects();
        };
        _proto.stopAll = function stopAll() {
          this.stopMusic();
          this.stopAllEffects();
        };
        _proto.setVolume = function setVolume(audioID, volume) {
          return audioID === 0 ? this.setMusicVolume(volume) : this.setEffectVolume(audioID, volume);
        };
        _proto.getVolume = function getVolume(audioID) {
          return audioID === 0 ? this.getMusicVolume() : this.getEffectVolume(audioID);
        }

        /**
         * 获取音频统计信息
         */;
        _proto.getStats = function getStats() {
          return {
            effectCount: this.effectMap.size,
            isMusicPlaying: this.isMusicPlaying(),
            musicVolume: this.musicVolume,
            effectVolume: this.effectVolume,
            musicMute: this.musicMute,
            effectMute: this.effectMute
          };
        };
        return AudioEngine;
      }(SingletonMgr));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SingtonClass.ts', './Audio.ts'], function (exports) {
  var _inheritsLoose, cclegacy, SingletonMgr, Audio;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      SingletonMgr = module.SingletonMgr;
    }, function (module) {
      Audio = module.Audio;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8e46bGKe0FNDqINR+uJLAri", "AudioManager", undefined);

      /**
       * 音频对象池管理器
       * 复用 Audio 对象，减少创建销毁开销
       */
      var AudioManager = exports('AudioManager', /*#__PURE__*/function (_SingletonMgr) {
        _inheritsLoose(AudioManager, _SingletonMgr);
        function AudioManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _SingletonMgr.call.apply(_SingletonMgr, [this].concat(args)) || this;
          _this.audioPool = [];
          _this.MAX_POOL_SIZE = 100;
          return _this;
        }
        var _proto = AudioManager.prototype;
        // 对象池最大容量
        /**
         * 从对象池获取 Audio 对象
         */
        _proto.getAudio = function getAudio() {
          if (this.audioPool.length > 0) {
            return this.audioPool.pop();
          }
          return new Audio();
        }

        /**
         * 将 Audio 对象放回对象池
         */;
        _proto.putAudio = function putAudio(audio) {
          if (!audio) return;
          audio.clear();

          // 限制对象池大小，避免内存占用过大
          if (this.audioPool.length < this.MAX_POOL_SIZE) {
            this.audioPool.push(audio);
          } else {
            audio.destroy();
          }
        }

        /**
         * 清空对象池
         */;
        _proto.clear = function clear() {
          this.audioPool.forEach(function (audio) {
            return audio.destroy();
          });
          this.audioPool = [];
        }

        /**
         * 获取对象池统计信息
         */;
        _proto.getPoolSize = function getPoolSize() {
          return this.audioPool.length;
        };
        return AudioManager;
      }(SingletonMgr));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BigBgFit.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, screen, view, UITransform, v3, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      screen = module.screen;
      view = module.view;
      UITransform = module.UITransform;
      v3 = module.v3;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "79e71Mw7d9JBJ5N4SnucO5V", "BigBgFit", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var BigBgFit = exports('BigBgFit', (_dec = ccclass('BigBgFit'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BigBgFit, _Component);
        function BigBgFit() {
          return _Component.apply(this, arguments) || this;
        }
        var _proto = BigBgFit.prototype;
        _proto.onLoad = function onLoad() {
          window.addEventListener("resize", this.resize.bind(this));
          //"window-resize" | "orientation-change" | "fullscreen-change";
          screen.on("window-resize", this.resize.bind(this));
          screen.on("orientation-change", this.resize.bind(this));
          screen.on("fullscreen-change", this.resize.bind(this));
          // view.setResizeCallback(this.resize.bind(this));
          // this.resize()
        };

        _proto.start = function start() {
          this.resize();
        };
        _proto.onDestroy = function onDestroy() {
          window.removeEventListener("resize", this.resize.bind(this));
          screen.off("window-resize", this.resize.bind(this));
          screen.off("orientation-change", this.resize.bind(this));
          screen.off("fullscreen-change", this.resize.bind(this));
        };
        _proto.resize = function resize() {
          var size = view.getVisibleSize();
          var nodeSize = this.node.getComponent(UITransform);
          var maxSize = Math.max((size == null ? void 0 : size.width) / nodeSize.width, size.height / nodeSize.height);
          if (maxSize < 1) {
            maxSize = 1;
          }
          this.node.setScale(v3(maxSize, maxSize, maxSize));
        };
        return BigBgFit;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EncryptUtil.ts", ['cc', './index.js'], function (exports) {
  var cclegacy, CryptoES;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      CryptoES = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a1d76B6VA1Jur71qkNoTd4a", "EncryptUtil", undefined);
      var EncryptUtil = exports('EncryptUtil', /*#__PURE__*/function () {
        function EncryptUtil() {}
        /**
         * MD5加密
         * @param msg 加密信息
         */
        EncryptUtil.md5 = function md5(msg) {
          return CryptoES.MD5(msg).toString();
        }

        /** 初始化加密库 */;
        EncryptUtil.initCrypto = function initCrypto(key, iv) {
          this.key = key;
          this.iv = CryptoES.enc.Hex.parse(iv);
        }

        /**
         * AES 加密
         * @param msg 加密信息
         * @param key aes加密的key 
         * @param iv  aes加密的iv
         */;
        EncryptUtil.aesEncrypt = function aesEncrypt(msg, key, iv) {
          return CryptoES.AES.encrypt(msg, this.key, {
            iv: this.iv,
            format: this.JsonFormatter
          }).toString();
        }

        /**
         * AES 解密
         * @param str 解密字符串
         * @param key aes加密的key 
         * @param iv  aes加密的iv
         */;
        EncryptUtil.aesDecrypt = function aesDecrypt(str, key, iv) {
          var decrypted = CryptoES.AES.decrypt(str, this.key, {
            iv: this.iv,
            format: this.JsonFormatter
          });
          return decrypted.toString(CryptoES.enc.Utf8);
        };
        return EncryptUtil;
      }());
      EncryptUtil.key = null;
      EncryptUtil.iv = null;
      EncryptUtil.JsonFormatter = {
        stringify: function stringify(cipherParams) {
          var jsonObj = {
            ct: cipherParams.ciphertext.toString(CryptoES.enc.Base64)
          };
          if (cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString();
          }
          if (cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString();
          }
          return JSON.stringify(jsonObj);
        },
        parse: function parse(jsonStr) {
          var jsonObj = JSON.parse(jsonStr);
          var cipherParams = CryptoES.lib.CipherParams.create({
            ciphertext: CryptoES.enc.Base64.parse(jsonObj.ct)
          });
          if (jsonObj.iv) {
            cipherParams.iv = CryptoES.enc.Hex.parse(jsonObj.iv);
          }
          if (jsonObj.s) {
            cipherParams.salt = CryptoES.enc.Hex.parse(jsonObj.s);
          }
          return cipherParams;
        }
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/engineEx.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "38184htAlZNULxGQdycQm37", "engineEx", undefined);

      //动态合图
      // macro.CLEANUP_IMAGE_CACHE = false;
      // DynamicAtlasManager.instance.enabled = true;
      // DynamicAtlasManager.instance.maxFrameSize = 512;
      // DynamicAtlasManager.instance.maxAtlasCount = 10;

      //固定帧率
      // game.frameRate = 50;

      // console.log('xsxs',macro.CLEANUP_IMAGE_CACHE)
      // console.log('xsxs',DynamicAtlasManager.instance.enabled)
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EventDispatcher.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './MessageManager.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, message;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      message = module.message;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bbb89vN2XhPt6h3mgR/Bw1c", "EventDispatcher", undefined);
      /**
       * 事件分发器 - 用于管理组件生命周期内的事件监听
       * 可以批量注册和清理事件，避免内存泄漏
       */
      var EventDispatcher = exports('EventDispatcher', /*#__PURE__*/function () {
        function EventDispatcher() {
          this.listeners = [];
        }
        var _proto = EventDispatcher.prototype;
        /**
         * 注册全局事件
         * @param event     事件名
         * @param listener  处理事件的侦听器函数
         * @param object    侦听函数绑定的作用域对象
         */
        _proto.on = function on(event, listener, object) {
          this.listeners.push({
            event: event,
            listener: listener,
            object: object
          });
          message.on(event, listener, object);
        }

        /**
         * 移除指定事件的所有监听器
         * @param event 事件名
         */;
        _proto.off = function off(event) {
          var toRemove = this.listeners.filter(function (record) {
            return record.event === event;
          });
          for (var _iterator = _createForOfIteratorHelperLoose(toRemove), _step; !(_step = _iterator()).done;) {
            var record = _step.value;
            message.off(record.event, record.listener, record.object);
          }
          this.listeners = this.listeners.filter(function (record) {
            return record.event !== event;
          });
        }

        /** 
         * 触发全局事件 
         * @param event      事件名
         * @param args       事件参数
         */;
        _proto.dispatchEvent = function dispatchEvent(event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          message.dispatchEvent.apply(message, [event].concat(args));
        }

        /**
         * 销毁事件对象，清除所有注册的监听器
         */;
        _proto.destroy = function destroy() {
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.listeners), _step2; !(_step2 = _iterator2()).done;) {
            var record = _step2.value;
            message.off(record.event, record.listener, record.object);
          }
          this.listeners = [];
        };
        return EventDispatcher;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FailDialog.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './PopupBase.ts', './Logger.ts', './MessageManager.ts', './GameEvent.ts', './GameSound.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, resources, PopupBase, Logger, message, GameEventEnum, GameSound;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      resources = module.resources;
    }, function (module) {
      PopupBase = module.PopupBase;
    }, function (module) {
      Logger = module.default;
    }, function (module) {
      message = module.message;
    }, function (module) {
      GameEventEnum = module.GameEventEnum;
    }, function (module) {
      GameSound = module.GameSound;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "35146y0KhNPSLzSjb/7FkUk", "FailDialog", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var FailDialog = exports('FailDialog', (_dec = ccclass('FailDialog'), _dec(_class = /*#__PURE__*/function (_PopupBase) {
        _inheritsLoose(FailDialog, _PopupBase);
        function FailDialog() {
          return _PopupBase.apply(this, arguments) || this;
        }
        var _proto = FailDialog.prototype;
        _proto.onLoad = function onLoad() {
          _PopupBase.prototype.onLoad.call(this);
        };
        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {}

        /**
        * 第一次创建将会在onLoad之前创建，后续将会在onEnable之前执行
        * @param data 传入数据
        */;
        _proto.init = function init(data) {};
        _proto.onBtnRestart = function onBtnRestart(event) {
          // debugger
          // Tween.stopAllByTarget(event.target as Node)
          // tween(event.target as Node)
          //     .by(0.1, { scale: v3(0.9, 0.9, 0.9) })
          //     .by(0.1, { scale: v3(1.0, 1.0, 1.0) })
          //     .start();
          GameSound.getInstance().playEffect('click', resources); // Changed from GameSound.playSound to GameSound.playEffect
          message.dispatchEvent(GameEventEnum.restartGame);
          // GameManager.gameManager.resetLevel();
          Logger.warn('点击了重新开始');
          this.hideUI();
        };
        _proto.onBtnBackHome = function onBtnBackHome(event) {
          // debugger
          // event.target
          // Tween.stopAllByTarget(event.target as Node)
          // tween(event.target as Node)
          //     .by(0.1, { scale: v3(0.9, 0.9, 0.9) })
          //     .by(0.1, { scale: v3(1.0, 1.0, 1.0) })
          //     .start();
          GameSound.getInstance().playEffect('click'); // Changed from GameSound.playSound to GameSound.playEffect
          message.dispatchEvent(GameEventEnum.backHome);
          message.dispatchEvent('BackHome');
          Logger.warn('点击了返回首页');
          this.hideUI();
        };
        return FailDialog;
      }(PopupBase)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameEvent.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "1ad22SBjClA0oUnyEhMBjnt", "GameEvent", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var GameEventEnum = exports('GameEventEnum', /*#__PURE__*/function (GameEventEnum) {
        GameEventEnum["gameState"] = "gameState";
        GameEventEnum["restartGame"] = "RestartGame";
        GameEventEnum["backHome"] = "BackHome";
        GameEventEnum["nextLv"] = "NextLv";
        GameEventEnum["updateTime"] = "UpdateTime";
        GameEventEnum["PAUSED"] = "Paused";
        return GameEventEnum;
      }({}));
      var GameEvent = exports('GameEvent', (_dec = ccclass('GameEvent'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameEvent, _Component);
        function GameEvent() {
          return _Component.apply(this, arguments) || this;
        }
        var _proto = GameEvent.prototype;
        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {};
        return GameEvent;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GridManager.ts', './Vehicle.ts', './MessageManager.ts', './PopupManager.ts', './GameEvent.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _extends, _createClass, cclegacy, _decorator, Label, Vec3, Input, resources, JsonAsset, Component, GridManager, VehicleType, Direction, message, PopupManager, GameEventEnum;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _extends = module.extends;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Vec3 = module.Vec3;
      Input = module.Input;
      resources = module.resources;
      JsonAsset = module.JsonAsset;
      Component = module.Component;
    }, function (module) {
      GridManager = module.GridManager;
    }, function (module) {
      VehicleType = module.VehicleType;
      Direction = module.Direction;
    }, function (module) {
      message = module.message;
    }, function (module) {
      PopupManager = module.PopupManager;
    }, function (module) {
      GameEventEnum = module.GameEventEnum;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "c3d4eX2eJCrze8SNFZ4kKvN", "GameManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      // 游戏状态数据结构

      var GameStateEnum = exports('GameStateEnum', /*#__PURE__*/function (GameStateEnum) {
        GameStateEnum[GameStateEnum["READY"] = 0] = "READY";
        GameStateEnum[GameStateEnum["PLAYING"] = 1] = "PLAYING";
        GameStateEnum[GameStateEnum["PAUSED"] = 2] = "PAUSED";
        GameStateEnum[GameStateEnum["WIN"] = 3] = "WIN";
        GameStateEnum[GameStateEnum["LOSE"] = 4] = "LOSE";
        GameStateEnum[GameStateEnum["RESULT"] = 5] = "RESULT";
        return GameStateEnum;
      }({}));
      var GameManager = exports('GameManager', (_dec = ccclass('GameManager'), _dec2 = property(GridManager), _dec3 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameManager, _Component);
        function GameManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "gridManager", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "levelLabel", _descriptor2, _assertThisInitialized(_this));
          // public  gameManager: GameManager = null!;
          // public GameStateEnum = GameStateEnum;
          _this.m_gameState = GameStateEnum.READY;
          _initializerDefineProperty(_this, "levelsResourcePath", _descriptor3, _assertThisInitialized(_this));
          _this.currentLevel = 0;
          _this.moveCount = 0;
          _this.selectedVehicle = null;
          _this.levels = [];
          _this.dragStartPos = new Vec3();
          _this.isDragging = false;
          // 保存路径的数据结构
          _this.solutionPath = [];
          _this.currentHintStep = 0;
          return _this;
        }
        var _proto = GameManager.prototype;
        _proto.onLoad = function onLoad() {
          this.gameState = GameStateEnum.READY;
          // this.gameManager = this;

          message.on(GameEventEnum.backHome, this.onBackHome, this);
          message.on(GameEventEnum.nextLv, this.nextLevel, this);
          message.on(GameEventEnum.restartGame, this.resetLevel, this);
          message.on(GameEventEnum.PAUSED, this.pauseGame, this);
        };
        _proto.onBackHome = function onBackHome() {};
        _proto.onGameOver = function onGameOver(isWin) {
          if (isWin) {
            this.gameState = GameStateEnum.WIN;
            PopupManager.instance.show({
              path: "dialog/SucDialog"
            });
          } else {
            this.gameState = GameStateEnum.LOSE;
            PopupManager.instance.show({
              path: "dialog/FailDialog"
            });
          }
        };
        _proto.start = function start() {
          var _this2 = this;
          this.setupInput();
          // 异步从 resources 加载，如果失败将使用默认关卡
          this.loadLevelsFromResourcesOrDefault(function () {
            // this.loadLevel(this.currentLevel);
            _this2.updateUI();
          });
        };
        _proto.onDestroy = function onDestroy() {
          // 清理输入监听
          this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        // 设置输入
        ;

        _proto.setupInput = function setupInput() {
          // 使用全局输入系统
          this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

          // if (this.rotateButton) {
          //     this.rotateButton.node.on(Button.EventType.CLICK, this.rotateSelectedVehicle, this);
          // }
        }

        // 旋转选中的车辆
        // private rotateSelectedVehicle() {
        //     if (this.selectedVehicle && this.selectedVehicle.vehicleType !== VehicleType.OBSTACLE) {
        //         if (this.gridManager.tryRotateVehicle(this.selectedVehicle)) {
        //             this.moveCount++;
        //             this.updateUI();
        //             console.log('车辆旋转成功！');
        //         } else {
        //             console.log('旋转失败：空间不足。需要 ' +
        //                 Math.max(this.selectedVehicle.width, this.selectedVehicle.height) +
        //                 '×' + Math.max(this.selectedVehicle.width, this.selectedVehicle.height) +
        //                 ' 的空间');
        //         }
        //     }
        // }

        // 触摸开始
        ;

        _proto.onTouchStart = function onTouchStart(event) {
          console.log('onTouchStart');
          if (this.gameState != GameStateEnum.PLAYING) {
            return;
          }

          // 获取触摸的世界坐标
          var worldPos = this.getTouchWorldPosition(event);
          console.log('Touch world pos:', worldPos.x, worldPos.y);
          this.selectedVehicle = this.gridManager.getVehicleAtPosition(worldPos);
          if (this.selectedVehicle && this.selectedVehicle.vehicleType !== VehicleType.OBSTACLE) {
            this.isDragging = true;
            this.dragStartPos.set(worldPos);
            console.log('id =', this.gridManager.getVehiclesId(this.selectedVehicle));
          }
        }

        // 触摸移动
        ;

        _proto.onTouchMove = function onTouchMove(event) {
          console.log('onTouchMove');
          if (!this.isDragging || !this.selectedVehicle) {
            return;
          }
          if (this.gameState != GameStateEnum.PLAYING) {
            return;
          }
          console.log('onTouchMove0');

          // 获取触摸的世界坐标
          var worldPos = this.getTouchWorldPosition(event);
          var delta = worldPos.subtract(this.dragStartPos);

          // 根据车辆方向判断移动
          console.log("Vehicle direction: " + this.selectedVehicle.direction + ", delta: (" + delta.x.toFixed(1) + ", " + delta.y.toFixed(1) + ")");
          if (this.selectedVehicle.direction === Direction.HORIZONTAL) {
            // 横向车辆只能左右移动
            if (Math.abs(delta.x) > this.gridManager.cellWidth / 2) {
              var direction = delta.x > 0 ? 1 : -1;
              console.log("Trying to move HORIZONTAL vehicle, deltaX: " + direction);
              if (this.gridManager.tryMoveVehicle(this.selectedVehicle, direction, 0)) {
                this.dragStartPos.set(worldPos);
                this.selectedVehicle = null;
                this.moveCount++;
                this.updateUI();
              }
            }
          } else if (this.selectedVehicle.direction === Direction.VERTICAL) {
            // 纵向车辆只能上下移动
            if (Math.abs(delta.y) > this.gridManager.cellHeight / 2) {
              var _direction = delta.y > 0 ? 1 : -1;
              console.log("Trying to move VERTICAL vehicle, deltaY: " + _direction);
              if (this.gridManager.tryMoveVehicle(this.selectedVehicle, 0, _direction)) {
                this.dragStartPos.set(worldPos);
                this.selectedVehicle = null;
                this.moveCount++;
                this.updateUI();
              }
            }
          }
        }

        // 触摸结束
        ;

        _proto.onTouchEnd = function onTouchEnd() {
          var _this3 = this;
          this.checkWin();
          this.isDragging = false;
          this.selectedVehicle = null;

          // 玩家移动后重新计算路径
          if (this.moveCount > 0) {
            this.scheduleOnce(function () {
              _this3.createSavePath();
            }, 0.1);
          }
        }

        // 获取触摸事件的世界坐标
        ;

        _proto.getTouchWorldPosition = function getTouchWorldPosition(event) {
          // 获取不同的坐标进行对比
          var location = event.getLocation(); // 视图坐标
          var uiLocation = event.getUILocation(); // UI 坐标

          console.log('event.getLocation():', location.x, location.y);
          console.log('event.getUILocation():', uiLocation.x, uiLocation.y);

          // 使用 UI 坐标（这是屏幕坐标，左下角为原点）
          return new Vec3(uiLocation.x, uiLocation.y, 0);
        };
        _proto.loadLevelsFromResourcesOrDefault = function loadLevelsFromResourcesOrDefault(onLoaded) {
          var _this4 = this;
          resources.load(this.levelsResourcePath, JsonAsset, function (err, asset) {
            if (err) {
              console.warn('无法从 resources 加载关卡，使用默认关卡：', err);
              // this.levels = this.getDefaultLevels();
              if (onLoaded) onLoaded();
              return;
            }
            try {
              var raw = asset.json;
              _this4.levels = raw;
            } catch (e) {
              console.error('解析资源中的关卡 JSON 失败，使用默认关卡', e);
              // this.levels = this.getDefaultLevels();
            }

            if (onLoaded) onLoaded();
          });
        }

        // 加载关卡
        ;

        _proto.loadLevel = function loadLevel(level) {
          var _this5 = this;
          var levelData = this.getLevelData(level);
          if (!levelData) return;
          console.log("Loading level " + level + "...");
          console.log("\u6821\u51C6\u51FA\u53E3\u4F4D\u7F6E\u5230\u8B66\u8F66\u6240\u5728\u884C/\u5217\uFF1AexitX=" + levelData.exitX + ", exitY=" + levelData.exitY);
          this.gridManager.loadLevel(levelData);
          this.moveCount = 0;
          this.updateUI();
          this.gameState = GameStateEnum.READY;
          this.scheduleOnce(function () {
            _this5.gameState = GameStateEnum.PLAYING;
            _this5.updateUI();
          }, 3);

          // 加载关卡后计算拯救路径
          this.scheduleOnce(function () {
            _this5.createSavePath();
          }, 0.1);
        }

        // 获取关卡数据：优先使用 `this.levels`（来自 JSON），否则返回内置默认关卡
        ;

        _proto.getLevelData = function getLevelData(level) {
          if (this.levels && this.levels.length > 0) {
            if (level >= 0 && level < this.levels.length) {
              return this.levels[level];
            }
            return this.levels[0];
          }
          return null;
        }

        // 更新UI
        ;

        _proto.updateUI = function updateUI() {
          if (this.levelLabel) {
            this.levelLabel.string = '第' + (" " + (this.currentLevel + 1)) + '关';
          }
        }

        // 检查胜利
        ;

        _proto.checkWin = function checkWin() {
          if (this.gridManager.checkWin()) {
            // this.gameState = GameStateEnum.WIN;
            this.onGameOver(true);
            console.log('游戏胜利！');
            this.onLevelComplete();
          }
        }

        // 关卡完成
        ;

        _proto.onLevelComplete = function onLevelComplete() {
          console.log('Level Complete!');

          // this.scheduleOnce(()=>{
          //     this.currentLevel++;
          //     this.loadLevel(this.currentLevel);
          // },2)
        }

        // 重置关卡
        ;

        _proto.resetLevel = function resetLevel() {
          this.loadLevel(this.currentLevel);
        };
        _proto.pauseGame = function pauseGame(event, isPause) {
          if (isPause == true) {
            if (this.gameState == GameStateEnum.PLAYING || this.gameState == GameStateEnum.READY) {
              this.gameState = GameStateEnum.PAUSED;
            }
          } else {
            // if (this.onGameOver(false);
            if (this.gameState == GameStateEnum.PAUSED) {
              this.gameState = GameStateEnum.PLAYING;
            }
          }
          console.log('游戏暂停！');
        }

        // 下一关
        ;

        _proto.nextLevel = function nextLevel(str, lv) {
          if (lv != undefined) {
            this.currentLevel = lv;
          } else {
            this.currentLevel++;
          }
          this.loadLevel(this.currentLevel);
        };
        // 提示功能：执行下一步提示
        _proto.showNextHint = function showNextHint() {
          if (this.solutionPath.length === 0) {
            console.log('还没有计算出解法，正在计算...');
            this.createSavePath();
            return false;
          }
          if (this.currentHintStep >= this.solutionPath.length) {
            console.log('已经是最后一步了！');
            return false;
          }
          var step = this.solutionPath[this.currentHintStep];
          var vehicles = this.gridManager.getVehicles();
          var vehicle = vehicles[step.vehicleIndex];
          if (vehicle && this.gridManager.tryMoveVehicle(vehicle, step.deltaX, step.deltaY)) {
            this.currentHintStep++;
            this.moveCount++;
            this.updateUI();
            this.checkWin();
            console.log("\u63D0\u793A\u6B65\u9AA4 " + this.currentHintStep + "/" + this.solutionPath.length);
            return true;
          }
          return false;
        }

        // 创建拯救路径（BFS 算法求解）
        ;

        _proto.createSavePath = function createSavePath() {
          console.log('开始计算拯救路径...');
          this.solutionPath = [];
          this.currentHintStep = 0;

          // 获取当前状态
          var initialState = this.captureGameState();

          // BFS 搜索
          var queue = [];
          var visited = new Set();
          queue.push({
            state: initialState,
            path: []
          });
          visited.add(this.stateToString(initialState));
          while (queue.length > 0) {
            var current = queue.shift();

            // 检查是否胜利
            if (this.isWinningState(current.state)) {
              this.solutionPath = current.path;
              console.log("\u627E\u5230\u89E3\u6CD5\uFF01\u5171\u9700 " + this.solutionPath.length + " \u6B65");
              return true;
            }

            // 尝试所有可能的移动
            for (var i = 0; i < current.state.vehicles.length; i++) {
              var vehicle = current.state.vehicles[i];

              // 跳过障碍物
              if (vehicle.type === VehicleType.OBSTACLE) {
                continue;
              }

              // 尝试四个方向的移动
              var moves = [{
                dx: 1,
                dy: 0
              },
              // 右
              {
                dx: -1,
                dy: 0
              },
              // 左
              {
                dx: 0,
                dy: 1
              },
              // 上
              {
                dx: 0,
                dy: -1
              } // 下
              ];

              for (var _i = 0, _moves = moves; _i < _moves.length; _i++) {
                var move = _moves[_i];
                var newState = this.tryMove(current.state, i, move.dx, move.dy);
                if (newState) {
                  var stateStr = this.stateToString(newState);
                  if (!visited.has(stateStr)) {
                    visited.add(stateStr);
                    var newPath = [].concat(current.path, [{
                      vehicleIndex: i,
                      deltaX: move.dx,
                      deltaY: move.dy
                    }]);
                    queue.push({
                      state: newState,
                      path: newPath
                    });
                  }
                }
              }
            }
          }
          console.log('未找到解法！');
          return false;
        }

        // 捕获当前游戏状态
        ;

        _proto.captureGameState = function captureGameState() {
          var vehicles = this.gridManager.getVehicles().map(function (v) {
            return {
              type: v.vehicleType,
              x: v.gridX,
              y: v.gridY,
              width: v.width,
              height: v.height
            };
          });
          return {
            time: this.gridManager.time,
            vehicles: vehicles,
            gridWidth: this.gridManager.gridWidth,
            gridHeight: this.gridManager.gridHeight,
            exitX: this.gridManager.exitX,
            exitY: this.gridManager.exitY
          };
        }

        // 将状态转换为字符串（用于去重）
        ;

        _proto.stateToString = function stateToString(state) {
          return state.vehicles.map(function (v) {
            return v.x + "," + v.y;
          }).join('|');
        }

        // 检查是否为胜利状态
        ;

        _proto.isWinningState = function isWinningState(state) {
          var policeVehicle = state.vehicles.find(function (v) {
            return v.type === VehicleType.POLICE;
          });
          if (!policeVehicle) return false;

          // 检查警车是否占据出口位置
          for (var i = 0; i < policeVehicle.width; i++) {
            for (var j = 0; j < policeVehicle.height; j++) {
              if (policeVehicle.x + i === state.exitX && policeVehicle.y + j === state.exitY) {
                return true;
              }
            }
          }
          return false;
        }

        // 尝试移动并返回新状态
        ;

        _proto.tryMove = function tryMove(state, vehicleIndex, deltaX, deltaY) {
          var vehicle = state.vehicles[vehicleIndex];

          // 检查车辆方向限制
          var isHorizontal = vehicle.width > vehicle.height;
          var isVertical = vehicle.height > vehicle.width;

          // 横向车辆只能左右移动
          if (isHorizontal && deltaY !== 0) {
            return null;
          }

          // 纵向车辆只能上下移动
          if (isVertical && deltaX !== 0) {
            return null;
          }
          var newX = vehicle.x + deltaX;
          var newY = vehicle.y + deltaY;

          // 检查边界
          if (newX < 0 || newY < 0 || newX + vehicle.width > state.gridWidth || newY + vehicle.height > state.gridHeight) {
            return null;
          }

          // 检查碰撞
          for (var i = 0; i < state.vehicles.length; i++) {
            if (i === vehicleIndex) continue;
            var other = state.vehicles[i];

            // 检查是否重叠
            if (this.checkOverlap(newX, newY, vehicle.width, vehicle.height, other.x, other.y, other.width, other.height)) {
              return null;
            }
          }

          // 创建新状态
          var newState = _extends({}, state, {
            vehicles: state.vehicles.map(function (v, i) {
              return i === vehicleIndex ? _extends({}, v, {
                x: newX,
                y: newY
              }) : _extends({}, v);
            })
          });
          return newState;
        }

        // 检查两个矩形是否重叠
        ;

        _proto.checkOverlap = function checkOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
          return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
        };
        _createClass(GameManager, [{
          key: "gameState",
          get: function get() {
            return this.m_gameState;
          },
          set: function set(value) {
            console.log('gameState', value);
            message.dispatchEvent("gameState", value);
            if (this.gameState === value) {
              return;
            }
            this.m_gameState = value;
          }
        }]);
        return GameManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gridManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "levelsResourcePath", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'levels';
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameSound.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SingtonClass.ts', './ResLoader.ts', './AudioEngine.ts'], function (exports) {
  var _inheritsLoose, cclegacy, AudioClip, resources, SingletonMgr, ResLoader, AudioEngine;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      AudioClip = module.AudioClip;
      resources = module.resources;
    }, function (module) {
      SingletonMgr = module.SingletonMgr;
    }, function (module) {
      ResLoader = module.ResLoader;
    }, function (module) {
      AudioEngine = module.AudioEngine;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b2281AMsHZOUIhHGQmUgQCG", "GameSound", undefined);
      var GameSound = exports('GameSound', /*#__PURE__*/function (_SingletonMgr) {
        _inheritsLoose(GameSound, _SingletonMgr);
        function GameSound() {
          return _SingletonMgr.apply(this, arguments) || this;
        }
        var _proto = GameSound.prototype;
        _proto.playEffect = function playEffect(url, bundle, loop) {
          if (bundle === void 0) {
            bundle = resources;
          }
          if (loop === void 0) {
            loop = false;
          }
          console.log("playEffect:", url);
          ResLoader.ins.load(bundle.name, url, AudioClip, function (err, clip) {
            if (err) {
              console.error(err);
              return;
            }
            AudioEngine.getInstance().playEffect(clip, loop);
          });
        };
        _proto.playMusic = function playMusic(url, bundle) {
          if (bundle === void 0) {
            bundle = resources;
          }
          console.log("playMusic:", url);
          ResLoader.ins.load(bundle.name, url, AudioClip, function (err, clip) {
            if (err) {
              console.error(err);
              return;
            }
            AudioEngine.getInstance().stopMusic(); // Stop any currently playing music
            AudioEngine.getInstance().playMusic(clip);
          });
        };
        return GameSound;
      }(SingletonMgr));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gameUI.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameManager.ts', './MessageManager.ts', './utls.ts', './GameEvent.ts', './GameSound.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, Button, UITransform, tween, v3, Vec3, Component, GameManager, GameStateEnum, message, utils, GameEventEnum, GameSound;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
      Button = module.Button;
      UITransform = module.UITransform;
      tween = module.tween;
      v3 = module.v3;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      GameManager = module.GameManager;
      GameStateEnum = module.GameStateEnum;
    }, function (module) {
      message = module.message;
    }, function (module) {
      utils = module.utils;
    }, function (module) {
      GameEventEnum = module.GameEventEnum;
    }, function (module) {
      GameSound = module.GameSound;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
      cclegacy._RF.push({}, "7fc11W8NKJAXpm1Z9OD29CX", "gameUI", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var gameUI = exports('gameUI', (_dec = ccclass('gameUI'), _dec2 = property(Node), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(GameManager), _dec6 = property(Label), _dec7 = property(Button), _dec8 = property(Node), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(gameUI, _Component);
        function gameUI() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "m_pro", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_timeLabel", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_levelLabel", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "gameManager", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "aniLabel", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_btnSetting", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_setNode", _descriptor7, _assertThisInitialized(_this));
          _this.m_proMax = 623;
          _this.m_curTime = 0;
          _this.m_totalTime = 10 * 60;
          _this.m_isPlayTime = false;
          _this.m_progress = null;
          return _this;
        }
        var _proto = gameUI.prototype;
        _proto.onLoad = function onLoad() {
          this.m_progress = this.m_pro.getComponent(UITransform);
          // message.dispatchEvent("gameState",value)
          message.on('gameState', this.onGameState, this);
          message.on(GameEventEnum.updateTime, this.onUpdateTime, this);
          this.m_btnSetting.node.on(Button.EventType.CLICK, this.onBtnSetting, this);
        };
        _proto.onUpdateTime = function onUpdateTime(event, time) {
          var _this2 = this;
          this.m_totalTime = time;
          this.m_curTime = 0;
          this.m_progress.width = (1 - this.m_curTime / this.m_totalTime) * this.m_proMax;
          this.m_timeLabel.string = utils.secToMin(this.m_totalTime - this.m_curTime);
          this.aniLabel.string = '3';
          tween(this.aniLabel.node).to(0.5, {
            scale: v3(2, 2, 2)
          }).to(0.5, {
            scale: Vec3.ONE
          }).call(function () {
            _this2.aniLabel.string = '2';
          }).to(0.5, {
            scale: v3(2, 2, 2)
          }).to(0.5, {
            scale: Vec3.ONE
          }).call(function () {
            _this2.aniLabel.string = '1';
          }).to(0.5, {
            scale: v3(2, 2, 2)
          }).to(0.5, {
            scale: Vec3.ONE
          }).call(function () {
            _this2.aniLabel.string = '';
          }).start();
        };
        _proto.onGameState = function onGameState(event, gameState) {
          // this.time
          if (gameState == GameStateEnum.READY) {
            this.m_curTime = 0;
          }
          if (gameState == GameStateEnum.PLAYING) {
            this.m_totalTime = this.gameManager.gridManager.time;
            this.m_isPlayTime = true;
            this.m_progress.width = this.m_proMax;
            // this.m_curTime = 0 
          } else if (gameState == GameStateEnum.PAUSED) {
            this.m_isPlayTime = false;
          } else {
            this.m_isPlayTime = false;
            this.m_progress.width = this.m_proMax;
            this.m_curTime = 0;
          }
        };
        _proto.onDestroy = function onDestroy() {
          message.offObj(this);
        };
        _proto.update = function update(dt) {
          if (this.m_isPlayTime == true) {
            if (this.m_curTime + dt >= this.m_totalTime) {
              this.m_isPlayTime = false;
              this.m_timeLabel.string = "00:00";
              this.m_curTime = 0;
              this.gameManager.onGameOver(false);
              return;
            }
            this.m_curTime += dt;
            if (this.m_progress) {
              this.m_progress.width = (1 - this.m_curTime / this.m_totalTime) * this.m_proMax;
              this.m_timeLabel.string = utils.secToMin(this.m_totalTime - this.m_curTime);
            }
          }
        };
        _proto.onBtnSetting = function onBtnSetting() {
          GameSound.getInstance().playEffect('click');
          this.m_setNode.active = !this.m_setNode.active;
        };
        _proto.onBtnTip = function onBtnTip() {
          if (!this.gameManager) {
            console.error('GameManager 未设置！');
            return;
          }

          // 显示下一步提示
          var success = this.gameManager.showNextHint();
          if (!success) {
            console.log('没有更多提示了！');
          } else {
            GameSound.getInstance().playEffect('click');
          }
        };
        _proto.onBtnRemove = function onBtnRemove() {};
        return gameUI;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "m_pro", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "m_timeLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "m_levelLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "aniLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "m_btnSetting", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "m_setNode", [_dec8], {
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

System.register("chunks:///_virtual/GridManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Vehicle.ts', './MessageManager.ts', './GameEvent.ts', './GameSound.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, cclegacy, _decorator, Prefab, Node, UITransform, instantiate, Vec3, Component, Vehicle, VehicleType, message, GameEventEnum, GameSound;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      Node = module.Node;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      Vehicle = module.Vehicle;
      VehicleType = module.VehicleType;
    }, function (module) {
      message = module.message;
    }, function (module) {
      GameEventEnum = module.GameEventEnum;
    }, function (module) {
      GameSound = module.GameSound;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "b2c3dTl9niQq83vEjRWeJAS", "GridManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var GridManager = exports('GridManager', (_dec = ccclass('GridManager'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GridManager, _Component);
        function GridManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "gridWidth", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "gridHeight", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "cellWidth", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "cellHeight", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "vehiclePrefab", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "cellPrefab", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "exitX", _descriptor7, _assertThisInitialized(_this));
          // 出口X坐标
          _initializerDefineProperty(_this, "exitY", _descriptor8, _assertThisInitialized(_this));
          // 出口Y坐标
          _this.time = 300;
          //通关所需要时间
          _this.vehicles = [];
          _this.grid = [];
          // 0表示空，其他数字表示车辆ID
          _this.selectedVehicle = null;
          _this.gridContainer = null;
          return _this;
        }
        var _proto = GridManager.prototype;
        _proto.start = function start() {
          this.initGrid();
          this.createGridVisual();
        }

        // 初始化网格
        ;

        _proto.initGrid = function initGrid() {
          this.grid = [];
          for (var i = 0; i < this.gridWidth; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.gridHeight; j++) {
              this.grid[i][j] = 0;
            }
          }
        }

        // 创建网格视觉效果
        ;

        _proto.createGridVisual = function createGridVisual() {
          this.gridContainer = new Node('GridContainer');
          this.gridContainer.setParent(this.node);
          var gridTransform = this.gridContainer.addComponent(UITransform);
          gridTransform.width = this.gridWidth * this.cellWidth;
          gridTransform.height = this.gridHeight * this.cellHeight;
          var nodeTransform = this.node.getComponent(UITransform);
          nodeTransform.width = this.gridWidth * this.cellWidth;
          nodeTransform.height = this.gridHeight * this.cellHeight;
          // nodeTransform
          // 创建网格背景
          for (var i = 0; i < this.gridWidth; i++) {
            for (var j = 0; j < this.gridHeight; j++) {
              var cell = instantiate(this.cellPrefab);
              cell.setParent(this.gridContainer);
              var x = (i + 0.5) * this.cellWidth;
              var y = (j + 0.5) * this.cellHeight;
              cell.setPosition(x - gridTransform.width * 0.5, y - gridTransform.height * 0.5, 0);
              var transform = cell.getComponent(UITransform);
              if (transform) {
                transform.width = this.cellWidth;
                transform.height = this.cellHeight;
              }
            }
          }
        }

        // 加载关卡（支持 LevelData 或直接传入 VehicleData[]）
        ;

        _proto.loadLevel = function loadLevel(levelOrVehicles) {
          // 如果传入的是数组，则当作老格式：只有车辆数据
          var level;
          if (Array.isArray(levelOrVehicles)) {
            level = {
              vehicles: levelOrVehicles,
              time: 300
            };
          } else {
            level = levelOrVehicles;
          }

          // 应用关卡配置（可选）
          if (typeof level.gridWidth === 'number') this.gridWidth = level.gridWidth;
          if (typeof level.gridHeight === 'number') this.gridHeight = level.gridHeight;
          if (typeof level.cellWidth === 'number') this.cellWidth = level.cellWidth;
          if (typeof level.cellHeight === 'number') this.cellHeight = level.cellHeight;
          if (typeof level.exitX === 'number') this.exitX = level.exitX;
          if (typeof level.exitY === 'number') this.exitY = level.exitY;
          if (typeof level.time === 'number') this.time = level.time;
          message.dispatchEvent(GameEventEnum.updateTime, this.time);
          this.clearVehicles();
          this.initGrid();

          // 重建网格视觉，确保出口标记和尺寸正确
          this.clearGridVisual();
          this.createGridVisual();
          var vehicleId = 1;
          for (var _iterator = _createForOfIteratorHelperLoose(level.vehicles), _step; !(_step = _iterator()).done;) {
            var data = _step.value;
            var vehicle = this.createVehicle(data, vehicleId);
            if (vehicle) {
              this.vehicles.push(vehicle);
              this.updateGridForVehicle(vehicle, vehicleId);
              vehicleId++;
            }
          }
          console.warn('loadLevel  for vehicle:', this.grid);
        };
        _proto.clearGridVisual = function clearGridVisual() {
          if (this.gridContainer) {
            this.gridContainer.destroy();
            this.gridContainer = null;
          }
        }

        // 创建车辆
        ;

        _proto.createVehicle = function createVehicle(data, id) {
          if (!this.vehiclePrefab) {
            console.error('Vehicle prefab not set!');
            return null;
          }
          var vehicleNode = instantiate(this.vehiclePrefab);
          vehicleNode.setParent(this.node);
          vehicleNode.name = "Vehicle_" + id;
          var vehicle = vehicleNode.getComponent(Vehicle);
          if (vehicle) {
            var nodeTransform = this.node.getComponent(UITransform);
            vehicle.init(data.type, data.width, data.height, data.x, data.y, this.cellWidth, this.cellHeight, nodeTransform);
          }
          return vehicle;
        }

        // 更新网格中车辆的占用情况
        ;

        _proto.updateGridForVehicle = function updateGridForVehicle(vehicle, id) {
          var cells = vehicle.getOccupiedCells();
          for (var _iterator2 = _createForOfIteratorHelperLoose(cells), _step2; !(_step2 = _iterator2()).done;) {
            var cell = _step2.value;
            if (cell.x >= 0 && cell.x < this.gridWidth && cell.y >= 0 && cell.y < this.gridHeight) {
              this.grid[cell.x][cell.y] = id;
            }
          }
          console.warn('updateGridForVehicle  for vehicle:', vehicle, this.grid);
        }

        // 清除网格中车辆的占用
        ;

        _proto.clearGridForVehicle = function clearGridForVehicle(vehicle) {
          var cells = vehicle.getOccupiedCells();
          for (var _iterator3 = _createForOfIteratorHelperLoose(cells), _step3; !(_step3 = _iterator3()).done;) {
            var cell = _step3.value;
            if (cell.x >= 0 && cell.x < this.gridWidth && cell.y >= 0 && cell.y < this.gridHeight) {
              this.grid[cell.x][cell.y] = 0;
            }
          }
          console.warn('Clear grid for vehicle:', vehicle, this.grid);
        }

        // 检查位置是否被占用
        ;

        _proto.isCellOccupied = function isCellOccupied(x, y, excludeVehicle) {
          if (excludeVehicle === void 0) {
            excludeVehicle = null;
          }
          if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
            return true;
          }
          var occupyId = this.grid[x][y];
          if (occupyId === 0) {
            return false;
          }
          if (excludeVehicle) {
            var excludeId = this.vehicles.indexOf(excludeVehicle) + 1;
            return occupyId !== excludeId;
          }
          return true;
        };
        _proto.getVehiclesId = function getVehiclesId(vehicle) {
          var vehicleId = this.vehicles.indexOf(vehicle) + 1;
          return vehicleId;
        }

        // 尝试移动车辆
        ;

        _proto.tryMoveVehicle = function tryMoveVehicle(vehicle, deltaX, deltaY) {
          if (!vehicle || vehicle.vehicleType === VehicleType.OBSTACLE) {
            return false;
          }
          var newX = vehicle.gridX + deltaX;
          var newY = vehicle.gridY + deltaY;

          // 检查新位置是否有效
          if (!vehicle.canMoveTo(newX, newY, this.gridWidth, this.gridHeight)) {
            return false;
          }

          // 检查新位置是否被其他车辆占用
          var vehicleId = this.vehicles.indexOf(vehicle) + 1;
          this.clearGridForVehicle(vehicle);
          for (var i = 0; i < vehicle.width; i++) {
            for (var j = 0; j < vehicle.height; j++) {
              if (this.isCellOccupied(newX + i, newY + j, vehicle)) {
                // 恢复原来的网格状态
                this.updateGridForVehicle(vehicle, vehicleId);
                return false;
              }
            }
          }
          GameSound.getInstance().playEffect('move');
          // 移动车辆
          vehicle.move(deltaX, deltaY);
          this.updateGridForVehicle(vehicle, vehicleId);
          return true;
        }

        // 尝试旋转车辆
        ;

        _proto.tryRotateVehicle = function tryRotateVehicle(vehicle) {
          if (!vehicle || vehicle.vehicleType === VehicleType.OBSTACLE) {
            return false;
          }
          var vehicleId = this.vehicles.indexOf(vehicle) + 1;
          var oldWidth = vehicle.width;
          var oldHeight = vehicle.height;

          // 计算旋转所需的最小空间
          // 对于 W×H 的车辆，需要 max(W,H) × max(W,H) 的空间才能旋转
          var requiredSpace = Math.max(oldWidth, oldHeight);

          // 清除当前占用
          this.clearGridForVehicle(vehicle);

          // 检查是否有足够的空间进行旋转
          // 需要检查 requiredSpace × requiredSpace 的区域是否都可用
          if (vehicle.gridX + requiredSpace > this.gridWidth || vehicle.gridY + requiredSpace > this.gridHeight) {
            this.updateGridForVehicle(vehicle, vehicleId);
            return false;
          }

          // 检查旋转所需的整个空间是否被占用
          for (var i = 0; i < requiredSpace; i++) {
            for (var j = 0; j < requiredSpace; j++) {
              if (this.isCellOccupied(vehicle.gridX + i, vehicle.gridY + j, vehicle)) {
                this.updateGridForVehicle(vehicle, vehicleId);
                return false;
              }
            }
          }

          // 执行旋转
          vehicle.rotate();
          this.updateGridForVehicle(vehicle, vehicleId);
          return true;
        }

        // 检查是否胜利
        ;

        _proto.checkWin = function checkWin() {
          for (var _iterator4 = _createForOfIteratorHelperLoose(this.vehicles), _step4; !(_step4 = _iterator4()).done;) {
            var vehicle = _step4.value;
            if (vehicle.vehicleType === VehicleType.POLICE) {
              if (vehicle.isAtExit(this.exitX, this.exitY)) {
                return true;
              }
            }
          }
          return false;
        }

        // 清除所有车辆
        ;

        _proto.clearVehicles = function clearVehicles() {
          for (var _iterator5 = _createForOfIteratorHelperLoose(this.vehicles), _step5; !(_step5 = _iterator5()).done;) {
            var vehicle = _step5.value;
            if (vehicle && vehicle.node) {
              vehicle.node.destroy();
            }
          }
          this.vehicles = [];
        }

        // 获取点击位置的车辆（使用世界坐标）
        ;

        _proto.getVehicleAtPosition = function getVehicleAtPosition(worldPos) {
          for (var _iterator6 = _createForOfIteratorHelperLoose(this.vehicles), _step6; !(_step6 = _iterator6()).done;) {
            var vehicle = _step6.value;
            var vehicleWorldPos = new Vec3();
            vehicle.node.getWorldPosition(vehicleWorldPos);
            var transform = vehicle.node.getComponent(UITransform);
            if (transform) {
              var halfWidth = transform.width / 2;
              var halfHeight = transform.height / 2;
              console.log("Checking vehicle at world pos (" + vehicleWorldPos.x + ", " + vehicleWorldPos.y + ") with size (" + transform.width + ", " + transform.height + ")");
              if (worldPos.x >= vehicleWorldPos.x - halfWidth && worldPos.x <= vehicleWorldPos.x + halfWidth && worldPos.y >= vehicleWorldPos.y - halfHeight && worldPos.y <= vehicleWorldPos.y + halfHeight) {
                console.log("Found vehicle at (" + vehicleWorldPos.x + ", " + vehicleWorldPos.y + ")");
                return vehicle;
              }
            }
          }
          console.log("No vehicle found at world pos (" + worldPos.x + ", " + worldPos.y + ")");
          return null;
        }

        // 获取所有车辆（用于求解算法）
        ;

        _proto.getVehicles = function getVehicles() {
          return this.vehicles;
        };
        return GridManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gridWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gridHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cellWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 110;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "cellHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 110;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "vehiclePrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cellPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "exitX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "exitY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HttpRequest.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Logger.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _createClass, cclegacy, error, sys, Logger;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      error = module.error;
      sys = module.sys;
    }, function (module) {
      Logger = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f1accTIB9JJcqfSDa9tOVoL", "HttpRequest", undefined);

      /** 当前请求地址集合 */
      var urls = {};
      var reqsCnt = {};
      /** 请求事件 */
      var HttpEvent = exports('HttpEvent', /*#__PURE__*/function (HttpEvent) {
        HttpEvent["NO_NETWORK"] = "http_request_no_network";
        HttpEvent["UNKNOWN_ERROR"] = "http_request_unknown_error";
        HttpEvent["TIMEOUT"] = "http_request_timout";
        return HttpEvent;
      }({}));

      /**
       * HTTP请求返回值
       */
      var HttpReturn = exports('HttpReturn', function HttpReturn() {
        /** 是否请求成功 */
        this.isSucc = false;
        /** 请求返回数据 */
        this.res = void 0;
        /** 请求错误数据 */
        this.err = void 0;
      });
      var HttpStatus = exports('HttpStatus', /*#__PURE__*/function (HttpStatus) {
        HttpStatus[HttpStatus["OK"] = 200] = "OK";
        return HttpStatus;
      }({}));
      var httpResult = exports('httpResult', function httpResult() {
        this.data = {};
        this.msg = "";
        this.status = 0;
      });

      /** HTTP请求 */
      var HttpRequest = exports('HttpRequest', /*#__PURE__*/function () {
        function HttpRequest() {
          /** 服务器地址 */
          this.server = "http://127.0.0.1/";
          /** 请求超时时间 */
          this.timeout = 10000;
          /** 自定义请求头信息 */
          this.header = new Map();
        }
        var _proto = HttpRequest.prototype;
        /**
         * 添加自定义请求头信息
         * @param name  信息名
         * @param value 信息值
         */
        _proto.addHeader = function addHeader(name, value) {
          this.header.set(name, value);
        }

        /**
         * HTTP GET请求
         * @param name                  协议名
         * @param onComplete            请求完整回调方法
         * @param params                查询参数
         * @example
        var param = '{"uid":12345}'
        var complete = (ret: HttpReturn) => {
            console.log(ret.res);
        }
        oops.http.getWithParams(name, complete, param);
         */;
        _proto.get = function get(name, onComplete, params) {
          if (params === void 0) {
            params = null;
          }
          this.sendRequest(name, params, false, onComplete);
        }

        /**
         * HTTP GET请求
         * @param name                  协议名
         * @param params                查询参数
         * @example 
        var txt = await oops.http.getAsync(name);
        if (txt.isSucc) {
            console.log(txt.res);
        }
         */;
        _proto.getAsync = function getAsync(name, params) {
          var _this = this;
          if (params === void 0) {
            params = null;
          }
          return new Promise(function (resolve, reject) {
            _this.sendRequest(name, params, false, function (ret) {
              resolve(ret);
            });
          });
        }

        /**
         * HTTP GET请求非文本格式数据
         * @param name                  协议名
         * @param onComplete            请求完整回调方法
         * @param params                查询参数
         */;
        _proto.getByArraybuffer = function getByArraybuffer(name, onComplete, params) {
          if (params === void 0) {
            params = null;
          }
          this.sendRequest(name, params, false, onComplete, 'arraybuffer', false);
        }

        /**
         * HTTP GET请求非文本格式数据
         * @param name                  协议名
         * @param params                查询参数
         * @returns Promise<any>
         */;
        _proto.getAsyncByArraybuffer = function getAsyncByArraybuffer(name, params) {
          var _this2 = this;
          if (params === void 0) {
            params = null;
          }
          return new Promise(function (resolve, reject) {
            _this2.sendRequest(name, params, false, function (ret) {
              resolve(ret);
            }, 'arraybuffer', false);
          });
        }

        /**
         * HTTP POST请求
         * @param name                  协议名
         * @param params                查询参数
         * @param onComplete      请求完整回调方法
         * @example
        var param = '{"LoginCode":"donggang_dev","Password":"e10adc3949ba59abbe56e057f20f883e"}'
        var complete = (ret: HttpReturn) => {
            console.log(ret.res);
        }
        oops.http.post(name, complete, param);
         */;
        _proto.post = function post(name, onComplete, params) {
          if (params === void 0) {
            params = null;
          }
          this.sendRequest(name, params, true, onComplete);
        };
        _proto.postJson = function postJson(name, onComplete, params) {
          if (params === void 0) {
            params = null;
          }
          this.sendRequestJson(name, params, true, onComplete);
        }

        /**
         * HTTP POST请求
         * @param name                  协议名
         * @param params                查询参数
         */;
        _proto.postAsync = function postAsync(name, params) {
          var _this3 = this;
          if (params === void 0) {
            params = null;
          }
          return new Promise(function (resolve, reject) {
            _this3.sendRequest(name, params, true, function (ret) {
              resolve(ret);
            });
          });
        }

        /**
         * 取消请求中的请求
         * @param name     协议名
         */;
        _proto.abort = function abort(name) {
          var xhr = urls[this.server + name];
          if (xhr) {
            xhr.abort();
          }
        }

        /**
         * 获得字符串形式的参数
         * @param params 参数对象
         * @returns 参数字符串
         */;
        _proto.getParamString = function getParamString(params) {
          var result = "";
          for (var name in params) {
            var data = params[name];
            if (data instanceof Object) {
              for (var key in data) result += key + "=" + data[key] + "&";
            } else {
              result += name + "=" + data + "&";
            }
          }
          return result.substring(0, result.length - 1);
        }

        /** 
         * Http请求 
         * @param name(string)              请求地址
         * @param params(JSON)              请求参数
         * @param isPost(boolen)            是否为POST方式
         * @param callback(function)        请求成功回调
         * @param responseType(string)      响应类型
         * @param isOpenTimeout(boolean)    是否触发请求超时错误
         */;
        _proto.sendRequest = function sendRequest(name, params, isPost, onComplete, responseType, isOpenTimeout) {
          var _this4 = this;
          if (isOpenTimeout === void 0) {
            isOpenTimeout = true;
          }
          if (name == null || name == '') {
            error("请求地址不能为空");
            return;
          }
          var url,
            newUrl,
            paramsStr = "";
          if (name.toLocaleLowerCase().indexOf("http") == 0) {
            url = name;
          } else {
            url = this.server + name;
          }
          Logger.warn(url, params);
          if (params) {
            paramsStr = this.getParamString(params);
            if (url.indexOf("?") > -1) newUrl = url + "&" + paramsStr;else newUrl = url + "?" + paramsStr;
          } else {
            newUrl = url;
          }
          var xhr = new XMLHttpRequest();
          // 防重复请求功能
          urls[newUrl] = xhr;
          if (reqsCnt[newUrl] == null) {
            reqsCnt[newUrl] = 0;
          } else {
            reqsCnt[newUrl] = reqsCnt[newUrl] + 1;
          }
          if (isPost) {
            xhr.open("POST", url);
          } else {
            xhr.open("GET", newUrl);
          }

          // 添加自定义请求头信息
          for (var _iterator = _createForOfIteratorHelperLoose(this.header), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
              key = _step$value[0],
              value = _step$value[1];
            xhr.setRequestHeader(key, value);
          }
          if (sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate;text/html;charset=UTF-8");
          }
          xhr.setRequestHeader("Accept", "application/json;charset=utf-8");
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

          // 请求超时
          if (isOpenTimeout) {
            xhr.timeout = this.timeout;
            xhr.ontimeout = function () {
              _this4.deleteCache(newUrl);
              ret.isSucc = false;
              ret.err = HttpEvent.TIMEOUT; // 超时
              if (onComplete) {
                try {
                  onComplete(ret);
                } catch (error) {
                  console.error(error, ret);
                }
              }
            };
          }

          // 响应结果
          var ret = new HttpReturn();
          xhr.onloadend = function () {
            if (xhr.status == 500) {
              _this4.deleteCache(newUrl);
              delete reqsCnt[newUrl];
              ret.isSucc = false;
              ret.err = HttpEvent.NO_NETWORK; // 断网
              if (onComplete) {
                try {
                  onComplete(ret);
                } catch (error) {
                  console.error(error, ret);
                }
              }
            }
          };
          xhr.onerror = function () {
            if (reqsCnt[newUrl] > 2) {
              _this4.deleteCache(newUrl);
              delete reqsCnt[newUrl]; //
              ret.isSucc = false;
              if (xhr.readyState == 0 || xhr.readyState == 1 || xhr.status == 0) {
                ret.err = HttpEvent.NO_NETWORK; // 断网
                console.error("断网");
              } else {
                ret.err = HttpEvent.UNKNOWN_ERROR; // 未知错误
                console.error("未知错误", xhr.readyState);
              }
              if (onComplete) {
                try {
                  onComplete(ret);
                } catch (error) {
                  console.error(error, ret);
                }
              }
            } else {
              //重新请求
              _this4.sendRequest(name, params, isPost, onComplete, responseType, isOpenTimeout);
            }
          };
          xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            _this4.deleteCache(newUrl);
            if (xhr.status == 200) {
              delete reqsCnt[newUrl]; //只有请求成功的时候才会删除
              ret.isSucc = true;
              if (responseType == 'arraybuffer') {
                xhr.responseType = responseType; // 加载非文本格式
                ret.res = xhr.response;
              } else {
                Logger.warn(url, xhr.response);
                ret.res = JSON.parse(xhr.response);
              }
              try {
                if (onComplete) {
                  onComplete(ret);
                }
              } catch (error) {
                console.error(error, ret);
              }
            } else {
              // console.log("打印状态", xhr.status, xhr.readyState)
              if (xhr.status != 0) {
                delete reqsCnt[newUrl]; //只有请求成功的时候才会删除
                ret.isSucc = true;
                if (responseType == 'arraybuffer') {
                  xhr.responseType = responseType; // 加载非文本格式
                  ret.res = xhr.response;
                } else {
                  if (xhr.response.length > 0) {
                    ret.res = JSON.parse(xhr.response);
                  } else {
                    ret.res = xhr.response;
                  }
                }
                try {
                  if (onComplete) {
                    onComplete(ret);
                  }
                } catch (error) {
                  console.error(error, url, xhr.response);
                }
              }
            }
          };

          // 发送请求
          if (params == null || params == "") {
            xhr.send();
          } else {
            xhr.send(paramsStr);
          }
        };
        _proto.deleteCache = function deleteCache(url) {
          delete urls[url];
        }

        /** 
         * Http请求 
         * @param name(string)              请求地址
         * @param params(JSON)              请求参数
         * @param isPost(boolen)            是否为POST方式
         * @param callback(function)        请求成功回调
         * @param responseType(string)      响应类型
         * @param isOpenTimeout(boolean)    是否触发请求超时错误
         */;
        _proto.sendRequestJson = function sendRequestJson(name, params, isPost, onComplete, responseType, isOpenTimeout) {
          var _this5 = this;
          if (isOpenTimeout === void 0) {
            isOpenTimeout = true;
          }
          if (name == null || name == '') {
            error("请求地址不能为空");
            return;
          }
          var url,
            newUrl,
            paramsStr = "";
          if (name.toLocaleLowerCase().indexOf("http") == 0) {
            url = name;
          } else {
            url = this.server + name;
          }
          Logger.warn(url, params);
          if (params) {
            paramsStr = this.getParamString(params);
            if (url.indexOf("?") > -1) newUrl = url + "&" + paramsStr;else newUrl = url + "?" + paramsStr;
          } else {
            newUrl = url;
          }
          var xhr = new XMLHttpRequest();
          // 防重复请求功能
          urls[newUrl] = xhr;
          if (reqsCnt[newUrl] == null) {
            reqsCnt[newUrl] = 0;
          } else {
            reqsCnt[newUrl] = reqsCnt[newUrl] + 1;
          }
          if (isPost) {
            xhr.open("POST", url);
          } else {
            xhr.open("GET", newUrl);
          }

          // 添加自定义请求头信息
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.header), _step2; !(_step2 = _iterator2()).done;) {
            var _step2$value = _step2.value,
              key = _step2$value[0],
              value = _step2$value[1];
            xhr.setRequestHeader(key, value);
          }
          if (sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate;text/html;charset=UTF-8");
          }
          xhr.setRequestHeader("Accept", "application/json;charset=utf-8");
          xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

          // 请求超时
          if (isOpenTimeout) {
            xhr.timeout = this.timeout;
            xhr.ontimeout = function () {
              _this5.deleteCache(newUrl);
              ret.isSucc = false;
              ret.err = HttpEvent.TIMEOUT; // 超时
              if (onComplete) {
                try {
                  onComplete(ret);
                } catch (error) {
                  console.error(error, ret);
                }
              }
            };
          }

          // 响应结果
          var ret = new HttpReturn();
          xhr.onloadend = function () {
            if (xhr.status == 500) {
              _this5.deleteCache(newUrl);
              delete reqsCnt[newUrl];
              ret.isSucc = false;
              ret.err = HttpEvent.NO_NETWORK; // 断网
              if (onComplete) {
                try {
                  onComplete(ret);
                } catch (error) {
                  console.error(error, ret);
                }
              }
            }
          };
          xhr.onerror = function () {
            if (reqsCnt[newUrl] > 2) {
              _this5.deleteCache(newUrl);
              delete reqsCnt[newUrl]; //
              ret.isSucc = false;
              if (xhr.readyState == 0 || xhr.readyState == 1 || xhr.status == 0) {
                ret.err = HttpEvent.NO_NETWORK; // 断网
                console.error("断网");
              } else {
                ret.err = HttpEvent.UNKNOWN_ERROR; // 未知错误
                console.error("未知错误", xhr.readyState);
              }
              if (onComplete) {
                try {
                  onComplete(ret);
                } catch (error) {
                  console.error(error, ret);
                }
              }
            } else {
              //重新请求
              _this5.sendRequestJson(name, params, isPost, onComplete, responseType, isOpenTimeout);
            }
          };
          xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            _this5.deleteCache(newUrl);
            if (xhr.status == 200) {
              delete reqsCnt[newUrl]; //只有请求成功的时候才会删除
              ret.isSucc = true;
              if (responseType == 'arraybuffer') {
                xhr.responseType = responseType; // 加载非文本格式
                ret.res = xhr.response;
              } else {
                Logger.warn(url, xhr.response);
                ret.res = JSON.parse(xhr.response);
              }
              try {
                if (onComplete) {
                  onComplete(ret);
                }
              } catch (error) {
                console.error(error, ret);
              }
            } else {
              // console.log("打印状态", xhr.status, xhr.readyState)
              if (xhr.status != 0) {
                delete reqsCnt[newUrl]; //只有请求成功的时候才会删除
                ret.isSucc = true;
                if (responseType == 'arraybuffer') {
                  xhr.responseType = responseType; // 加载非文本格式
                  ret.res = xhr.response;
                } else {
                  if (xhr.response.length > 0) {
                    ret.res = JSON.parse(xhr.response);
                  } else {
                    ret.res = xhr.response;
                  }
                }
                try {
                  if (onComplete) {
                    onComplete(ret);
                  }
                } catch (error) {
                  console.error(error, url, xhr.response);
                }
              }
            }
          };

          // 发送请求
          if (params == null || params == "") {
            xhr.send();
          } else {
            xhr.send(JSON.stringify(params));
          }
        };
        _createClass(HttpRequest, null, [{
          key: "inst",
          get: function get() {
            if (this._inst == null) {
              this._inst = new HttpRequest();
            }
            return this._inst;
          }
        }]);
        return HttpRequest;
      }());
      HttpRequest._inst = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Jiami.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SingtonClass.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, SingletonMgr;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      SingletonMgr = module.SingletonMgr;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "e4f217WrCBKfJe6yYtT4dcg", "Jiami", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var jiami = exports('jiami', (_dec = ccclass('jiami'), _dec(_class = /*#__PURE__*/function (_SingletonMgr) {
        _inheritsLoose(jiami, _SingletonMgr);
        function jiami() {
          return _SingletonMgr.apply(this, arguments) || this;
        }
        return jiami;
      }(SingletonMgr)) || _class));
      var jiamiCtrl = exports('jiamiCtrl', jiami.getInstance());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Logger.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "832d8z6QHtHSL/m1yJ0/nUY", "Logger", undefined);
      /**
       * 日志等级枚举
       */
      var LogLv = exports('LogLv', /*#__PURE__*/function (LogLv) {
        LogLv[LogLv["DEBUG"] = 0] = "DEBUG";
        LogLv[LogLv["INFO"] = 1] = "INFO";
        LogLv[LogLv["WARN"] = 2] = "WARN";
        LogLv[LogLv["TRACE"] = 3] = "TRACE";
        LogLv[LogLv["ERROR"] = 4] = "ERROR";
        return LogLv;
      }({}));
      /**
       * 日志信息
       * @export
       * @class LogInfo
       */
      // export class LogInfo {
      //     level: number;
      //     msg: string;
      //     time: string;
      // }

      /**
       * 日志
       * @export
       * @class Logger
       */
      var Logger = exports('default', /*#__PURE__*/function () {
        function Logger() {}
        /**
         * 设置Log记录等级
         *
         * @static
         * @param {LogLv} level
         * @memberof Logger
         */
        Logger.SetLevel = function SetLevel(level) {
          this.level = Number(level);
        }
        /**
         * 收集、打印调试等级的日志
         * Logger.debug("log");
         * @static
         * @param {string} msg
         * @param {string} [tag="default"]
         * @return {*}  {void}
         * @memberof Logger
         */;
        Logger.debug = function debug(message) {
          var _console;
          if (Logger.level > LogLv.DEBUG) {
            return;
          }
          //测试功能 自动寻找方法
          for (var _len = arguments.length, optionalParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            optionalParams[_key - 1] = arguments[_key];
          }
          (_console = console).log.apply(_console, [this.FormatDate(Date.now(), "HH:mm:ss") + " " + message].concat(optionalParams));
        };
        Logger.log = function log(message) {
          var _console2;
          if (Logger.level > LogLv.DEBUG) {
            return;
          }
          //测试功能 自动寻找方法
          for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            optionalParams[_key2 - 1] = arguments[_key2];
          }
          (_console2 = console).log.apply(_console2, [this.FormatDate(Date.now(), "HH:mm:ss") + " " + message].concat(optionalParams));
        };
        Logger.info = function info(message) {
          var _console3;
          if (Logger.level > LogLv.INFO) {
            return;
          }
          for (var _len3 = arguments.length, optionalParams = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            optionalParams[_key3 - 1] = arguments[_key3];
          }
          (_console3 = console).info.apply(_console3, [this.FormatDate(Date.now(), "HH:mm:ss") + " " + message].concat(optionalParams));
        };
        Logger.warn = function warn(message) {
          var _console4;
          if (Logger.level > LogLv.WARN) {
            return;
          }
          for (var _len4 = arguments.length, optionalParams = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            optionalParams[_key4 - 1] = arguments[_key4];
          }
          (_console4 = console).warn.apply(_console4, [this.FormatDate(Date.now(), "HH:mm:ss") + " " + message].concat(optionalParams));
        };
        Logger.error = function error(message) {
          var _console5;
          if (Logger.level > LogLv.ERROR) {
            return;
          }
          for (var _len5 = arguments.length, optionalParams = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            optionalParams[_key5 - 1] = arguments[_key5];
          }
          (_console5 = console).error.apply(_console5, [this.FormatDate(Date.now(), "HH:mm:ss") + " " + message].concat(optionalParams));
        };
        Logger.trace = function trace(message) {
          var _console6;
          if (Logger.level > LogLv.ERROR) {
            return;
          }
          for (var _len6 = arguments.length, optionalParams = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            optionalParams[_key6 - 1] = arguments[_key6];
          }
          (_console6 = console).trace.apply(_console6, [this.FormatDate(Date.now(), "HH:mm:ss") + " " + message].concat(optionalParams));
        }
        /**
         * 格式化时间
         * 调用 FormatDate(strDate, "yyyy-MM-dd HH:mm:ss")
         * @param strDate （中国标准时间）时间戳等
         * @param strFormat 返回格式
         * @returns
         */;
        Logger.FormatDate = function FormatDate(strDate, strFormat) {
          if (!strDate) return;
          if (!strFormat) strFormat = "yyyy-MM-dd";
          switch (typeof strDate) {
            case "string":
              strDate = new Date(strDate.replace(/-/g, "/"));
              break;
            case "number":
              strDate = new Date(strDate);
              break;
          }
          if (strDate instanceof Date) {
            var dict = {
              yyyy: strDate.getFullYear(),
              M: strDate.getMonth() + 1,
              d: strDate.getDate(),
              H: strDate.getHours(),
              m: strDate.getMinutes(),
              s: strDate.getSeconds(),
              MM: ("" + (strDate.getMonth() + 101)).substr(1),
              dd: ("" + (strDate.getDate() + 100)).substr(1),
              HH: ("" + (strDate.getHours() + 100)).substr(1),
              mm: ("" + (strDate.getMinutes() + 100)).substr(1),
              ss: ("" + (strDate.getSeconds() + 100)).substr(1)
            };
            return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
              return dict[arguments[0]];
            });
          }
        }

        /**
         * eLog - displays calling line number & message & dumps vars as pretty json string
         * @param {string} msg - string to display in log message
         * @param {any} dispVars - any number of variables (ellipsis , aka Rest parameters) to dump
         * {@link https://github.com/evanw/node-source-map-support usable by typescript node-source-map-support module}
         * {@link https://github.com/mozilla/source-map/ Mozilla source-map library & project}
         * {@link http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ good introduction to sourcemaps}
        */;
        Logger.eLog = function eLog(msg) {
          //console.dir((new Error).stack);
          /**
           * go one line back for the caller
           * @type {string}
           */
          var stackLine = new Error().stack.split("\n")[2];
          console.dir(stackLine);
          var stackLineSelect = stackLine.split(" ");
          for (var i = 0; i < stackLineSelect.length; i++) {
            var element = stackLineSelect[i];
            Logger.debug("---" + element);
          }
          var selectFunction = stackLineSelect[5];
          Logger.debug("触发方法为" + selectFunction);
          /**
           * retrieve the file basename & positional data, after the last `/` to the `)` 
           */
          // 
          var caller_line = stackLine.slice(stackLine.lastIndexOf('/'), stackLine.lastIndexOf(')'));
          console.dir(caller_line);
        };
        return Logger;
      }());
      /**
       * log等级
       * 
       * @public
       * @static
       * @type {number}
       * @memberof Logger
       */
      Logger.level = 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./Sudoku.ts', './GameManager.ts', './GridManager.ts', './Vehicle.ts', './AsyncQueue.ts', './BigBgFit.ts', './EncryptUtil.ts', './HttpRequest.ts', './Jiami.ts', './Logger.ts', './PoolManager.ts', './SingtonClass.ts', './StorageManager.ts', './ToastMgr.ts', './engineEx.ts', './EventDispatcher.ts', './MessageManager.ts', './ResLoader.ts', './PopupBase.ts', './PopupManager.ts', './Audio.ts', './AudioEngine.ts', './AudioManager.ts', './utls.ts', './GameEvent.ts', './GameSound.ts', './MainPage.ts', './FailDialog.ts', './SucDialog.ts', './gameUI.ts', './start.ts', './toastUI.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/MainPage.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './MessageManager.ts', './GameEvent.ts', './GameManager.ts', './StorageManager.ts', './Logger.ts', './GameSound.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, profiler, Component, message, GameEventEnum, GameStateEnum, StorageManager, Logger, GameSound;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
      profiler = module.profiler;
      Component = module.Component;
    }, function (module) {
      message = module.message;
    }, function (module) {
      GameEventEnum = module.GameEventEnum;
    }, function (module) {
      GameStateEnum = module.GameStateEnum;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      Logger = module.default;
    }, function (module) {
      GameSound = module.GameSound;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "bc6c8w5xkxCk6NiIF0kxLRt", "MainPage", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var MainPage = exports('MainPage', (_dec = ccclass('MainPage'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(MainPage, _Component);
        function MainPage() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "m_bg", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_btnStart", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_lvLabel", _descriptor3, _assertThisInitialized(_this));
          _this.m_lv = 0;
          return _this;
        }
        var _proto = MainPage.prototype;
        _proto.onLoad = function onLoad() {
          if (profiler.isShowingStats()) {
            profiler.hideStats();
          }
          message.on(GameEventEnum.backHome, this.onBackHome, this);
          // message.dispatchEvent("gameState", value)
          message.on("gameState", this.onGameState, this);
          //  message.dispatchEvent(GameEventEnum.backHome)

          var currentLv = StorageManager.ins.getNumber("currentLv", 0);
          this.m_lv = currentLv != null ? currentLv : 0;
          this.m_lvLabel.string = "第" + (this.m_lv + 1) + '关';
        };
        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {};
        _proto.onBackHome = function onBackHome() {
          this.m_bg.active = true;
          GameSound.getInstance().playEffect('click');
        };
        _proto.onBtnStart = function onBtnStart() {
          GameSound.getInstance().playEffect('click');
          message.dispatchEvent(GameEventEnum.nextLv, this.m_lv);
          this.m_bg.active = false;
        };
        _proto.onGameState = function onGameState(str, value) {
          // this.m_lv = value.lv;f
          if (value == GameStateEnum.WIN) {
            // this.m_lv = message.get("level");
            this.m_lv++;
            Logger.info("before win", this.m_lv);
            StorageManager.ins.set("currentLv", this.m_lv);
          }
          this.m_lvLabel.string = "第" + (this.m_lv + 1) + '关';
        };
        return MainPage;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "m_bg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "m_btnStart", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "m_lvLabel", [_dec4], {
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

System.register("chunks:///_virtual/MessageManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, warn, log;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      warn = module.warn;
      log = module.log;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c4facMQC7RC/JVNlkq5p0o6", "MessageManager", undefined);

      /**
       * 全局事件监听方法
       * @param event      事件名
       * @param args       事件参数
       */
      var MessageManager = /*#__PURE__*/function () {
        function MessageManager() {
          this.events = new Map();
        }
        var _proto = MessageManager.prototype;
        /**
         * 注册全局事件
         * @param event      事件名
         * @param listener   处理事件的侦听器函数
         * @param object     侦听函数绑定的作用域对象
         */
        _proto.on = function on(event, listener, object) {
          if (!event || !listener) {
            warn("\u6CE8\u518C\u3010" + event + "\u3011\u4E8B\u4EF6\u7684\u4FA6\u542C\u5668\u51FD\u6570\u4E3A\u7A7A");
            return;
          }
          var eds = this.events.get(event);
          if (!eds) {
            eds = [];
            this.events.set(event, eds);
          }

          // 检查是否重复注册
          if (eds.some(function (ed) {
            return ed.listener === listener && ed.object === object;
          })) {
            warn("\u540D\u4E3A\u3010" + event + "\u3011\u7684\u4E8B\u4EF6\u91CD\u590D\u6CE8\u518C\u4FA6\u542C\u5668");
            return;
          }
          var data = {
            event: event,
            listener: listener,
            object: object
          };
          eds.push(data);
        }

        /**
         * 监听一次事件，事件响应后，该监听自动移除
         * @param event     事件名
         * @param listener  事件触发回调方法
         * @param object    侦听函数绑定的作用域对象
         */;
        _proto.once = function once(event, listener, object) {
          var _this = this;
          var onceListener = function onceListener($event) {
            _this.off(event, onceListener, object);
            for (var _len = arguments.length, $args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              $args[_key - 1] = arguments[_key];
            }
            listener.call.apply(listener, [object, $event].concat($args));
          };
          this.on(event, onceListener, object);
        }
        /**
         * 移除全局事件
         * @param event     事件名
         * @param listener  处理事件的侦听器函数
         * @param object    侦听函数绑定的作用域对象
         */;
        _proto.off = function off(event, listener, object) {
          var eds = this.events.get(event);
          if (!eds) {
            log("\u540D\u4E3A\u3010" + event + "\u3011\u7684\u4E8B\u4EF6\u4E0D\u5B58\u5728");
            return;
          }
          var index = eds.findIndex(function (ed) {
            return ed.listener === listener && ed.object === object;
          });
          if (index !== -1) {
            eds.splice(index, 1);
          }
          if (eds.length === 0) {
            this.events["delete"](event);
          }
        }

        /** 
         * 触发全局事件 
         * @param event      事件名
         * @param args       事件参数
         */;
        _proto.dispatchEvent = function dispatchEvent(event) {
          var list = this.events.get(event);
          if (!list || list.length === 0) {
            return;
          }

          // 复制数组，避免在回调中修改事件列表导致问题
          var eds = [].concat(list);
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          for (var _iterator = _createForOfIteratorHelperLoose(eds), _step; !(_step = _iterator()).done;) {
            var ed = _step.value;
            try {
              var _ed$listener;
              (_ed$listener = ed.listener).call.apply(_ed$listener, [ed.object, event].concat(args));
            } catch (error) {
              warn("\u4E8B\u4EF6\u3010" + event + "\u3011\u7684\u76D1\u542C\u5668\u6267\u884C\u51FA\u9519:", error);
            }
          }
        }

        /** 
         * 触发全局事件,支持同步与异步处理
         * @param event      事件名
         * @param args       事件参数
         * @example          事件响应示例
            onTest(event: string, args: any): Promise<void> {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        console.log("异步事件逻辑");
                        resolve();
                    }, 2000);
                });
            }
         */;
        _proto.dispatchEventAsync = /*#__PURE__*/
        function () {
          var _dispatchEventAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
            var list,
              eds,
              _len3,
              args,
              _key3,
              _iterator2,
              _step2,
              ed,
              _ed$listener2,
              _args = arguments;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  list = this.events.get(event);
                  if (!(!list || list.length === 0)) {
                    _context.next = 3;
                    break;
                  }
                  return _context.abrupt("return");
                case 3:
                  // 复制数组，避免在回调中修改事件列表导致问题
                  eds = [].concat(list);
                  for (_len3 = _args.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    args[_key3 - 1] = _args[_key3];
                  }
                  _iterator2 = _createForOfIteratorHelperLoose(eds);
                case 6:
                  if ((_step2 = _iterator2()).done) {
                    _context.next = 18;
                    break;
                  }
                  ed = _step2.value;
                  _context.prev = 8;
                  _context.next = 11;
                  return Promise.resolve((_ed$listener2 = ed.listener).call.apply(_ed$listener2, [ed.object, event].concat(args)));
                case 11:
                  _context.next = 16;
                  break;
                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](8);
                  warn("\u5F02\u6B65\u4E8B\u4EF6\u3010" + event + "\u3011\u7684\u76D1\u542C\u5668\u6267\u884C\u51FA\u9519:", _context.t0);
                case 16:
                  _context.next = 6;
                  break;
                case 18:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[8, 13]]);
          }));
          function dispatchEventAsync(_x) {
            return _dispatchEventAsync.apply(this, arguments);
          }
          return dispatchEventAsync;
        }()
        /**
         * 移除指定对象注册的所有事件监听器
         * @param object 侦听函数绑定的作用域对象
         */;

        _proto.offObj = function offObj(object) {
          for (var _iterator3 = _createForOfIteratorHelperLoose(this.events.entries()), _step3; !(_step3 = _iterator3()).done;) {
            var _step3$value = _step3.value,
              _event = _step3$value[0],
              eds = _step3$value[1];
            var filtered = eds.filter(function (ed) {
              return ed.object !== object;
            });
            if (filtered.length === 0) {
              this.events["delete"](_event);
            } else if (filtered.length !== eds.length) {
              this.events.set(_event, filtered);
            }
          }
        }

        /**
         * 移除指定事件的所有监听器
         * @param event 事件名
         */;
        _proto.offAll = function offAll(event) {
          this.events["delete"](event);
        }

        /**
         * 清除所有事件监听器
         */;
        _proto.clear = function clear() {
          this.events.clear();
        }

        /**
         * 获取事件监听器数量
         * @param event 事件名（可选，不传则返回所有事件的监听器总数）
         */;
        _proto.getListenerCount = function getListenerCount(event) {
          if (event) {
            var _this$events$get;
            return ((_this$events$get = this.events.get(event)) == null ? void 0 : _this$events$get.length) || 0;
          }
          var count = 0;
          this.events.forEach(function (eds) {
            return count += eds.length;
          });
          return count;
        }

        /**
         * 检查是否有监听器
         * @param event 事件名
         */;
        _proto.hasListener = function hasListener(event) {
          var eds = this.events.get(event);
          return eds !== undefined && eds.length > 0;
        };
        return MessageManager;
      }();
      var message = exports('message', new MessageManager());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PoolManager.ts", ['cc'], function (exports) {
  var cclegacy, NodePool, instantiate;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      NodePool = module.NodePool;
      instantiate = module.instantiate;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c3da6VVwAxBe7SO6MfIBLX+", "PoolManager", undefined);
      var PoolManager = /*#__PURE__*/function () {
        function PoolManager() {
          this._dictPool = new Map();
          this._dictPool = new Map();
        }
        PoolManager.getInstance = function getInstance() {
          if (!this._instance) {
            this._instance = new PoolManager();
          }
          return this._instance;
        }

        /**
         * 获取预制体名称
         */;
        var _proto = PoolManager.prototype;
        _proto.getPrefabName = function getPrefabName(prefab) {
          var _prefab$data;
          // @ts-ignore
          return ((_prefab$data = prefab.data) == null ? void 0 : _prefab$data.name) || prefab.name;
        }

        /**
         * 获取或创建对象池
         */;
        _proto.getOrCreatePool = function getOrCreatePool(name) {
          var pool = this._dictPool.get(name);
          if (!pool) {
            pool = new NodePool();
            this._dictPool.set(name, pool);
          }
          return pool;
        }

        /**
         * 根据预设从对象池中获取对应节点
         */;
        _proto.getNode = function getNode(prefab, parent) {
          var name = this.getPrefabName(prefab);
          var pool = this.getOrCreatePool(name);
          var node = null;

          // 从对象池获取节点
          if (pool.size() > 0) {
            node = pool.get();
          }

          // 如果对象池为空或节点无效，创建新节点
          if (!node || !node.isValid) {
            node = instantiate(prefab);
          }
          if (parent) {
            node.parent = parent;
          }
          node.active = true;
          return node;
        }

        /**
         * 将对应节点放回对象池中
         */;
        _proto.putNode = function putNode(node) {
          if (!node || !node.isValid) {
            return;
          }
          var name = node.name;
          var pool = this.getOrCreatePool(name);

          // 重置节点状态
          node.active = false;
          node.parent = null;
          pool.put(node);
        }

        /**
         * 根据名称，清除对应对象池
         */;
        _proto.clearPool = function clearPool(name) {
          var pool = this._dictPool.get(name);
          if (pool) {
            pool.clear();
            this._dictPool["delete"](name);
          }
        }

        /**
         * 清除所有对象池
         */;
        _proto.clearAllPools = function clearAllPools() {
          this._dictPool.forEach(function (pool) {
            return pool.clear();
          });
          this._dictPool.clear();
        }

        /**
         * 获取对象池大小
         */;
        _proto.getPoolSize = function getPoolSize(name) {
          var pool = this._dictPool.get(name);
          return pool ? pool.size() : 0;
        }

        /**
         * 预生成对象池
         * @param prefab 预制体
         * @param num 需要预加载的数量
         */;
        _proto.preloadPool = function preloadPool(prefab, num) {
          if (num <= 0) return;
          var name = this.getPrefabName(prefab);
          var pool = this.getOrCreatePool(name);
          for (var i = 0; i < num; i++) {
            var node = instantiate(prefab);
            node.active = false;
            pool.put(node);
          }
        };
        return PoolManager;
      }();
      // 使用 Map 替代普通对象
      PoolManager._instance = void 0;
      var poolMgr = exports('poolMgr', PoolManager.getInstance());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PopupBase.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './MessageManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, CCBoolean, Enum, BlockInputEvents, v3, tween, Component, message;
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
      CCBoolean = module.CCBoolean;
      Enum = module.Enum;
      BlockInputEvents = module.BlockInputEvents;
      v3 = module.v3;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      message = module.message;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "5003cLP2cBNKoO18C0z6vqA", "PopupBase", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var AnimType = exports('AnimType', /*#__PURE__*/function (AnimType) {
        AnimType[AnimType["SCALE"] = 0] = "SCALE";
        AnimType[AnimType["FADE"] = 1] = "FADE";
        return AnimType;
      }({}));
      var PopupBase = exports('PopupBase', (_dec = ccclass('PopupBase'), _dec2 = property(CCBoolean), _dec3 = property(CCBoolean), _dec4 = property({
        type: Enum(AnimType),
        visible: function visible() {
          return this.anim;
        }
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(PopupBase, _Component);
        function PopupBase() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "blockInput", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "anim", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "animType", _descriptor3, _assertThisInitialized(_this));
          _this._popupName = "";
          return _this;
        }
        var _proto = PopupBase.prototype;
        _proto.onLoad = function onLoad() {
          if (this.blockInput) {
            var block = this.node.getComponent(BlockInputEvents);
            if (!block) {
              block = this.node.addComponent(BlockInputEvents);
            }
            block.enabled = true;
          } else {
            var _block = this.node.getComponent(BlockInputEvents);
            if (_block) {
              _block.enabled = false;
            }
          }
        };
        _proto._init = function _init(name, params) {
          this._popupName = name;
          this.init(params);
        }

        /**
         * 第一次创建将会在onLoad之前创建，后续将会在onEnable之前执行
         * @param data 传入数据
         */;
        _proto.init = function init(data) {};
        _proto._show = function _show() {
          var _this2 = this;
          this.node.active = true;
          if (this.anim) {
            this.node.scale = v3(0, 0, 1);
            tween(this.node).to(0.2, {
              scale: v3(1.1, 1.1, 1)
            }).to(0.05, {
              scale: v3(1, 1, 1)
            }).call(function () {
              _this2.onShow();
            }).start();
          } else {
            this.onShow();
          }
        }

        /**
         * 动画播放完后显示，onEnable之后执行
         */;
        _proto.onShow = function onShow() {};
        _proto._hide = function _hide() {
          this.onHide();
          this.node.active = false;
        };
        _proto.onHide = function onHide() {};
        _proto._remove = function _remove() {
          this.node.destroy();
        };
        _proto.hideUI = function hideUI() {
          message.dispatchEvent('popup_hide', this.popupName);
          // PopupManager.instance.hide(this.popupName);
        };

        _proto.removeUI = function removeUI() {
          message.dispatchEvent('popup_remove', this.popupName);
          // PopupManager.instance.remove(this.popupName);
        };

        _createClass(PopupBase, [{
          key: "popupName",
          get: function get() {
            return this._popupName;
          }
        }]);
        return PopupBase;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "blockInput", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "anim", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "animType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return AnimType.SCALE;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PopupManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ResLoader.ts', './PopupBase.ts', './Logger.ts', './MessageManager.ts'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, _createClass, cclegacy, instantiate, Prefab, UITransform, view, Node, Layers, Canvas, director, v3, Vec3, ResLoader, PopupBase, Logger, message;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      instantiate = module.instantiate;
      Prefab = module.Prefab;
      UITransform = module.UITransform;
      view = module.view;
      Node = module.Node;
      Layers = module.Layers;
      Canvas = module.Canvas;
      director = module.director;
      v3 = module.v3;
      Vec3 = module.Vec3;
    }, function (module) {
      ResLoader = module.ResLoader;
    }, function (module) {
      PopupBase = module.PopupBase;
    }, function (module) {
      Logger = module.default;
    }, function (module) {
      message = module.message;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4bb41XN07pOTKu23AgIRoFp", "PopupManager", undefined);
      var PopupManager = exports('PopupManager', /*#__PURE__*/function () {
        function PopupManager() {
          this.loadingNode = null;
          this.dialogNode = null;
          this.tipNode = null;
          this.popupNode = null;
          // 分别管理不同类型的弹窗
          this.dialogPops = [];
          this.loadingPops = [];
          this.tipPops = [];
          this.nodes = new Map();
          this.paths = new Map();
          this.popupInit = false;
          this.eventListenersAttached = false;
          this.hideCallback = void 0;
          this.removeCallback = void 0;
        }
        var _proto = PopupManager.prototype;
        _proto.init = function init() {
          this.setParent();
        };
        _proto.preLoad = function preLoad(option) {
          var _option$prefab,
            _this = this;
          this.setParent();
          var name = option.name || ((_option$prefab = option.prefab) == null ? void 0 : _option$prefab.data._name) || this.getNameByPath(option.url);
          if (name && this.nodes.has(name)) {
            Logger.warn(name + "\u5DF2\u7ECF\u9884\u52A0\u8F7D\u4E86");
            return;
          }
          if (option.prefab) {
            var node = instantiate(option.prefab);
            this.nodes.set(name, node);
            return;
          }
          if (option.url) {
            ResLoader.ins.load(option.url, Prefab, function (err, prefab) {
              var _prefab$data;
              if (err) {
                Logger.error(option.url + "\u52A0\u8F7D\u5931\u8D25");
                return;
              }
              var prefabName = ((_prefab$data = prefab.data) == null ? void 0 : _prefab$data._name) || '';
              _this.setNameByPath(option.url, prefabName);
              var finalName = name || prefabName;
              var node = instantiate(prefab);
              _this.nodes.set(finalName, node);
            });
          }
        };
        _proto.getPopupName = function getPopupName(option) {
          var _option$prefab2;
          return option.name || ((_option$prefab2 = option.prefab) == null || (_option$prefab2 = _option$prefab2.data) == null ? void 0 : _option$prefab2._name) || this.getNameByPath(option.path);
        };
        _proto.loadAndShow = function loadAndShow(bundleName, path, name, priority, params, keep) {
          var _this2 = this;
          ResLoader.ins.load(bundleName, path, Prefab, function (err, prefab) {
            if (err) {
              Logger.error(path + "\u52A0\u8F7D\u5931\u8D25");
              return;
            }
            _this2.setNameByPath(path, prefab.data._name);
            var finalName = name || prefab.data._name;
            var node = instantiate(prefab);
            if (finalName) {
              _this2.nodes.set(finalName, node);
            }

            // 如果是tip类型，强制设置keep为true，以允许多个tip同时存在
            var isTip = finalName && finalName.toLowerCase().includes('tip');
            var actualKeep = isTip ? true : keep;
            _this2._show(finalName, node, priority, params, actualKeep);
          });
        };
        _proto.show = function show(option) {
          if (!this.popupInit) {
            this.setParent();
          }
          var name = this.getPopupName(_extends({}, option, {
            path: option.path
          }));
          if (!name && !option.path) {
            throw new Error('name、prefab、path不能同时为空');
          }
          var bundleName = option.bundleName || "resources";
          var priority = option.priority || 0;
          var node = name ? this.nodes.get(name) : undefined;
          if (!node) {
            if (!option.prefab) {
              if (!option.path) {
                throw new Error('首次创建必须传入prefab或者path');
              }
              this.loadAndShow(bundleName, option.path, name, priority, option.params, option.keep || false);
              return;
            }
            node = instantiate(option.prefab);
            if (name) {
              this.nodes.set(name, node);
            }
          }
          if (name && node) {
            // 如果是tip类型，强制设置keep为true，以允许多个tip同时存在
            var isTip = name.toLowerCase().includes('tip');
            var keep = isTip ? true : option.keep || false;
            this._show(name, node, priority, option.params, keep);
          }
        }

        /**
         * 根据名称获取弹窗类型
         */;
        _proto.getPopupType = function getPopupType(name) {
          var lowerName = name.toLowerCase();
          if (lowerName.includes('loading')) return 'loading';
          if (lowerName.includes('tip')) return 'tip';
          return 'dialog';
        }

        /**
         * 根据类型获取对应的数组和父节点
         */;
        _proto.getTypeConfig = function getTypeConfig(type) {
          switch (type) {
            case 'loading':
              return {
                array: this.loadingPops,
                parent: this.loadingNode
              };
            case 'tip':
              return {
                array: this.tipPops,
                parent: this.tipNode
              };
            default:
              return {
                array: this.dialogPops,
                parent: this.dialogNode
              };
          }
        }

        /**
         * 设置节点的父节点和 UITransform
         */;
        _proto.setupNode = function setupNode(node, parent, priority) {
          if (parent && node.parent !== parent) {
            node.removeFromParent();
            node.parent = parent;
          }
          var uiTransform = node.getComponent(UITransform);
          if (!uiTransform) {
            uiTransform = node.addComponent(UITransform);
          }
          if (uiTransform.priority !== priority) {
            uiTransform.priority = priority;
          }
        }

        /**
         * 获取当前弹窗的优先级
         */;
        _proto.getCurrentPriority = function getCurrentPriority(targetArray) {
          var _currentNode$getCompo;
          if (targetArray.length === 0) return 0;
          var currentName = targetArray[targetArray.length - 1];
          var currentNode = this.nodes.get(currentName);
          return (currentNode == null || (_currentNode$getCompo = currentNode.getComponent(UITransform)) == null ? void 0 : _currentNode$getCompo.priority) || 0;
        };
        _proto._show = function _show(name, node, priority, params, keep) {
          var type = this.getPopupType(name);
          var _this$getTypeConfig = this.getTypeConfig(type),
            targetArray = _this$getTypeConfig.array,
            parent = _this$getTypeConfig.parent;
          var isTip = type === 'tip';
          var popup = node.getComponent(PopupBase);
          if (!popup) {
            throw new Error('请将Popup继承PopupBase');
          }
          popup._init(name, params);
          this.setupNode(node, parent, priority);
          if (isTip) {
            // Tip 类型不限制数量，直接添加并显示
            targetArray.push(name);
            popup._show();
            return;
          }

          // 非 tip 类型按优先级处理
          var curPriority = this.getCurrentPriority(targetArray);
          if (priority < curPriority) {
            // 优先级低，插入到合适位置但不显示
            node.active = false;
            for (var i = 0; i < targetArray.length; i++) {
              var _tempNode$getComponen;
              var tempNode = this.nodes.get(targetArray[i]);
              if (tempNode && priority <= (((_tempNode$getComponen = tempNode.getComponent(UITransform)) == null ? void 0 : _tempNode$getComponen.priority) || 0)) {
                targetArray.splice(i, 0, name);
                break;
              }
            }
          } else {
            // 优先级高或相等
            if (!keep) {
              this._hideAll();
            }
            var idx = targetArray.indexOf(name);
            if (idx >= 0) {
              targetArray.splice(idx, 1);
            }
            targetArray.push(name);
            popup._show();
          }
        }

        /**
         * 显示指定类型数组中的最后一个弹窗
         */;
        _proto.showLastByType = function showLastByType(type) {
          var _this$getTypeConfig2 = this.getTypeConfig(type),
            targetArray = _this$getTypeConfig2.array;
          if (targetArray.length === 0) return;
          var lastName = targetArray[targetArray.length - 1];
          var node = this.nodes.get(lastName);
          if (node && !node.active) {
            var _node$getComponent;
            (_node$getComponent = node.getComponent(PopupBase)) == null || _node$getComponent._show();
          }
        };
        _proto.hide = function hide(name) {
          var type = this.getPopupType(name);
          var _this$getTypeConfig3 = this.getTypeConfig(type),
            targetArray = _this$getTypeConfig3.array;
          var idx = targetArray.indexOf(name);
          var isLast = idx === targetArray.length - 1;
          if (idx >= 0) {
            targetArray.splice(idx, 1);
          }
          this._hideUI(name);

          // 显示同类型的下一个弹窗
          if (isLast && type !== 'tip') {
            this.showLastByType(type);
          }
        }

        // Loading相关方法
        ;

        _proto.showLoading = function showLoading(option) {
          if (option.name && !option.name.toLowerCase().includes('loading')) {
            option.name += 'Loading';
          } else if (!option.name) {
            option.name = 'Loading';
          }
          this.show(option);
        }

        // Tip相关方法
        ;

        _proto.showTip = function showTip(option) {
          if (option.name && !option.name.toLowerCase().includes('tip')) {
            option.name += 'Tip';
          } else if (!option.name) {
            option.name = 'Tip';
          }
          this.show(option);
        };
        _proto.hideAllLoading = function hideAllLoading() {
          var _this3 = this;
          [].concat(this.loadingPops).forEach(function (name) {
            return _this3.hide(name);
          });
        };
        _proto.hideAllTips = function hideAllTips() {
          var _this4 = this;
          [].concat(this.tipPops).forEach(function (name) {
            return _this4.hide(name);
          });
        };
        _proto.hideAll = function hideAll() {
          this._hideAll();
          this.dialogPops.length = 0;
          this.loadingPops.length = 0;
          this.tipPops.length = 0;
        };
        _proto._hideAll = function _hideAll() {
          var _this5 = this;
          var allPops = [].concat(this.dialogPops, this.loadingPops, this.tipPops);
          allPops.forEach(function (name) {
            return _this5._hideUI(name);
          });
        };
        _proto._hideUI = function _hideUI(name) {
          var _node$getComponent2;
          var node = this.nodes.get(name);
          if (!node) {
            Logger.warn(name + "\u5DF2\u88AB\u9500\u6BC1");
            return;
          }
          (_node$getComponent2 = node.getComponent(PopupBase)) == null || _node$getComponent2._hide();
        };
        _proto.remove = function remove(name) {
          var _node$getComponent3;
          this.hide(name);
          var node = this.nodes.get(name);
          if (!node) return;
          this.nodes["delete"](name);
          (_node$getComponent3 = node.getComponent(PopupBase)) == null || _node$getComponent3._remove();
        };
        _proto.removeAll = function removeAll() {
          this.hideAll();
          // 清空所有缓存的节点
          for (var _iterator = _createForOfIteratorHelperLoose(this.nodes), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
              _name = _step$value[0];
            this.remove(_name);
          }
        };
        _proto.getPopup = function getPopup(name) {
          return this.nodes.get(name) || null;
        }

        /**
         * 获取loading节点
         */;
        _proto.getLoadingNode = function getLoadingNode() {
          return this.loadingNode;
        }

        /**
         * 获取tip节点
         */;
        _proto.getTipNode = function getTipNode() {
          return this.tipNode;
        }

        /**
         * 获取dialog节点
         */;
        _proto.getDialogNode = function getDialogNode() {
          return this.dialogNode;
        };
        _proto.setNameByPath = function setNameByPath(path, name) {
          if (null == this.getNameByPath(path)) {
            this.paths.set(path, name);
          }
        };
        _proto.getNameByPath = function getNameByPath(path) {
          if (null == path) {
            return null;
          }
          return this.paths.get(path);
        };
        _proto.setParent = function setParent() {
          var _this6 = this,
            _director$getScene;
          if (this.popupInit) {
            Logger.error('PopupManager已经初始化了');
            return;
          }

          // 只绑定一次事件监听器
          if (!this.eventListenersAttached) {
            this.hideCallback = function (event, name) {
              _this6.hide(name);
            };
            this.removeCallback = function (event, name) {
              _this6.remove(name);
            };
            message.on('popup_hide', this.hideCallback, this);
            message.on('popup_remove', this.removeCallback, this);
            this.eventListenersAttached = true;
          }
          var size = view.getVisibleSize();

          // 创建主容器节点
          this.popupNode = new Node('Popup');
          this.popupNode.layer = Layers.Enum.UI_2D;
          this.popupNode.addComponent(Canvas);
          (_director$getScene = director.getScene()) == null || _director$getScene.addChild(this.popupNode);
          director.addPersistRootNode(this.popupNode);
          var transform = this.popupNode.addComponent(UITransform);
          transform.priority = 98;
          transform.contentSize = size;
          this.popupNode.position = v3(size.width / 2, size.height / 2, 0);

          // 创建loading节点
          this.loadingNode = new Node('loadingNode');
          this.loadingNode.layer = Layers.Enum.UI_2D;
          transform = this.loadingNode.addComponent(UITransform);
          transform.priority = 99;
          transform.contentSize = size;
          this.loadingNode.position = Vec3.ZERO;
          this.popupNode.addChild(this.loadingNode);

          // 创建dialog节点
          this.dialogNode = new Node('Dialog');
          this.dialogNode.layer = Layers.Enum.UI_2D;
          transform = this.dialogNode.addComponent(UITransform);
          transform.priority = 100;
          transform.contentSize = size;
          this.dialogNode.position = Vec3.ZERO;
          this.popupNode.addChild(this.dialogNode);

          // 创建tip节点
          this.tipNode = new Node('tipNode');
          this.tipNode.layer = Layers.Enum.UI_2D;
          transform = this.tipNode.addComponent(UITransform);
          transform.priority = 101;
          transform.contentSize = size;
          this.tipNode.position = Vec3.ZERO;
          this.popupNode.addChild(this.tipNode);
          this.popupInit = true;
        }

        /**
         * 销毁PopupManager，清理资源
         */;
        _proto.destroy = function destroy() {
          if (this.eventListenersAttached) {
            message.off('popup_hide', this.hideCallback, this);
            message.off('popup_remove', this.removeCallback, this);
            this.eventListenersAttached = false;
          }
          this.removeAll();
          this.popupInit = false;
          if (this.popupNode) {
            this.popupNode.destroy();
            this.popupNode = null;
          }
          PopupManager._instance = null;
        };
        _createClass(PopupManager, null, [{
          key: "instance",
          get: function get() {
            if (!PopupManager._instance) {
              PopupManager._instance = new PopupManager();
            }
            return PopupManager._instance;
          }
        }]);
        return PopupManager;
      }());
      PopupManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ResLoader.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createClass, _asyncToGenerator, _regeneratorRuntime, _createForOfIteratorHelperLoose, cclegacy, assetManager, error, Asset, js, resources;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      assetManager = module.assetManager;
      error = module.error;
      Asset = module.Asset;
      js = module.js;
      resources = module.resources;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b16d6k2sBBLpKAYRWp6P98Y", "ResLoader", undefined);

      // 类型定义

      /**
       * 资源加载器
       * 统一管理游戏中的资源加载、释放等操作
       */
      var ResLoader = exports('ResLoader', /*#__PURE__*/function () {
        function ResLoader() {
          /** 全局默认加载的资源包名 */
          this.defaultBundleName = "resources";
          /** 正在加载的资源队列 */
          this.loadingQueue = new Map();
        } // Cocos Creator底层已提供并发控制，无需额外设置

        /**
         * 加载远程资源
         * @param url           资源地址
         * @param options       资源参数，例：{ ext: ".png" }
         * @param onComplete    加载完成回调
         * @example
        var opt: IRemoteOptions = { ext: ".png" };
        var onComplete = (err: Error | null, data: ImageAsset) => {
        const texture = new Texture2D();
        texture.image = data;
        
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        
        var sprite = this.sprite.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        }
        oops.res.loadRemote<ImageAsset>(this.url, opt, onComplete);
         */
        var _proto = ResLoader.prototype;
        _proto.loadRemote = function loadRemote(url) {
          var options = null;
          var onComplete = null;
          if ((arguments.length <= 1 ? 0 : arguments.length - 1) == 2) {
            options = arguments.length <= 1 ? undefined : arguments[1];
            onComplete = arguments.length <= 2 ? undefined : arguments[2];
          } else {
            onComplete = arguments.length <= 1 ? undefined : arguments[1];
          }
          assetManager.loadRemote(url, options, onComplete);
        }

        /**
         * 加载资源包
         * @param url       资源地址
         * @param v         资源MD5版本号
         * @example
        var serverUrl = "http://192.168.1.8:8080/";         // 服务器地址
        var md5 = "8e5c0";                                  // Cocos Creator 构建后的MD5字符
        await oops.res.loadBundle(serverUrl,md5);
         */;
        _proto.loadBundle = function loadBundle(url, v) {
          return new Promise(function (resolve, reject) {
            assetManager.loadBundle(url, {
              version: v
            }, function (err, bundle) {
              if (err) {
                error(err);
                reject(err);
                return;
              }
              resolve(bundle);
            });
          });
        }

        /**
         * 加载一个资源
         * @param bundleName    远程包名
         * @param paths         资源路径
         * @param type          资源类型
         * @param onProgress    加载进度回调
         * @param onComplete    加载完成回调
         * @example
        oops.res.load("spine_path", sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
        
        });
         */;
        _proto.load = function load(bundleName, paths, type, onProgress, onComplete) {
          var args = null;
          if (typeof paths === "string" || paths instanceof Array) {
            args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
            args.bundle = bundleName;
          } else {
            args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
            args.bundle = this.defaultBundleName;
          }
          this.loadByArgs(args);
        };
        _proto.loadAsync = function loadAsync(bundleNameOrPaths, pathsOrType, type) {
          var _this = this;
          return new Promise(function (resolve, reject) {
            // 判断是哪种调用方式
            if (typeof bundleNameOrPaths === 'string' && (typeof pathsOrType !== 'string' || Array.isArray(pathsOrType))) {
              // 调用形式: loadAsync(paths, type)
              var _paths = bundleNameOrPaths;
              var _type = pathsOrType;
              _this.load(_paths, _type, function (err, asset) {
                if (err) {
                  error(err.message);
                  reject(err);
                } else {
                  resolve(asset);
                }
              });
            } else {
              // 调用形式: loadAsync(bundleName, paths, type)
              var _bundleName = bundleNameOrPaths;
              var _paths2 = pathsOrType;
              _this.load(_bundleName, _paths2, type || null, function (err, asset) {
                if (err) {
                  error(err.message);
                  reject(err);
                } else {
                  resolve(asset);
                }
              });
            }
          });
        }

        /**
         * 加载文件夹中的资源
         * @param bundleName    远程包名
         * @param dir           文件夹名
         * @param type          资源类型
         * @param onProgress    加载进度回调
         * @param onComplete    加载完成回调
         * @example
        // 加载进度事件
        var onProgressCallback = (finished: number, total: number, item: any) => {
        console.log("资源加载进度", finished, total);
        }
        
        // 加载完成事件
        var onCompleteCallback = () => {
        console.log("资源加载完成");
        }
        oops.res.loadDir("game", onProgressCallback, onCompleteCallback);
         */;
        _proto.loadDir = function loadDir(bundleName, dir, type, onProgress, onComplete) {
          var args = null;
          if (typeof dir === "string") {
            args = this.parseLoadResArgs(dir, type, onProgress, onComplete);
            args.bundle = bundleName;
          } else {
            args = this.parseLoadResArgs(bundleName, dir, type, onProgress);
            args.bundle = this.defaultBundleName;
          }
          args.dir = args.paths;
          this.loadByArgs(args);
        }

        /**
         * 通过资源相对路径释放资源
         * @param path          资源路径
         * @param bundleName    远程资源包名
         */;
        _proto.release = function release(path, bundleName) {
          if (bundleName == null) bundleName = this.defaultBundleName;
          var bundle = assetManager.getBundle(bundleName);
          if (bundle) {
            var asset = bundle.get(path);
            if (asset) {
              this.releasePrefabtDepsRecursively(asset);
            }
          }
        }

        /**
         * 通过相对文件夹路径删除所有文件夹中资源
         * @param path          资源文件夹路径
         * @param bundleName    远程资源包名
         */;
        _proto.releaseDir = function releaseDir(path, bundleName) {
          var _this2 = this;
          if (bundleName == null) bundleName = this.defaultBundleName;
          var bundle = assetManager.getBundle(bundleName);
          if (bundle) {
            var infos = bundle.getDirWithPath(path);
            if (infos) {
              infos.map(function (info) {
                _this2.releasePrefabtDepsRecursively(info.uuid);
              });
            }
            if (path == "" && bundleName != "resources") {
              assetManager.removeBundle(bundle);
            }
          }
        }

        /** 释放预制依赖资源 */;
        _proto.releasePrefabtDepsRecursively = function releasePrefabtDepsRecursively(uuid) {
          if (uuid instanceof Asset) {
            uuid.decRef();
          } else {
            var asset = assetManager.assets.get(uuid);
            if (asset) {
              asset.decRef();
            }
          }
        }
        /**
         * 销毁一个bundle中所有的资源
         * @param bundleName 默认为resources，如果是远程bundle，则使用url末位作为bundle名
         */;
        _proto.releaseAll = function releaseAll(bundleName) {
          if (bundleName === void 0) {
            bundleName = 'resources';
          }
          var bundle = assetManager.getBundle(bundleName);
          if (!bundle) {
            error("Bundle \"" + bundleName + "\" \u4E0D\u5B58\u5728");
            return;
          }

          // 只释放自己内部的资源，依赖的资源只减少引用计数
          bundle.getDirWithPath('/', Asset).forEach(function (asset) {
            bundle.release(asset.path, asset.ctor);
          });
          // cocos提供的方法会将依赖的资源也卸载(这个设计很奇怪)
          // bundle.releaseAll();
        }

        /**
         * 获取一个已经加载的bundle
         * @param bundleName 默认为resources，如果是远程bundle，则使用url末位作为bundle名
         */;
        _proto.getBundle = function getBundle(bundleName) {
          if (bundleName === void 0) {
            bundleName = 'resources';
          }
          return assetManager.getBundle(bundleName);
        }

        /**
         * 移除一个已经加载的bundle
         * @param bundleName 默认为resources，如果是远程bundle，则使用url末位作为bundle名
         */;
        _proto.removeBundle = function removeBundle(bundleName) {
          if (bundleName === void 0) {
            bundleName = 'resources';
          }
          var bundle = assetManager.getBundle(bundleName);
          if (bundle) {
            assetManager.removeBundle(bundle);
          }
        }

        /**
         * 获取资源
         * @param path          资源路径
         * @param type          资源类型
         * @param bundleName    远程资源包名
         */;
        _proto.get = function get(path, type, bundleName) {
          if (bundleName === void 0) {
            bundleName = this.defaultBundleName;
          }
          var bundle = assetManager.getBundle(bundleName);
          if (!bundle) {
            error("Bundle \"" + bundleName + "\" \u4E0D\u5B58\u5728");
            return null;
          }
          return bundle.get(path, type);
        }

        /** 
         * 打印缓存中所有资源信息 
         * @param detailed 是否打印详细信息
         */;
        _proto.dump = function dump(detailed) {
          if (detailed === void 0) {
            detailed = false;
          }
          console.log("===== 资源管理器信息 =====");
          console.log("\u603B\u8D44\u6E90\u6570: " + assetManager.assets.count);
          console.log("\u6B63\u5728\u52A0\u8F7D\u7684\u8D44\u6E90\u6570: " + this.loadingQueue.size);
          if (detailed) {
            console.log("\n===== 资源详情 =====");
            assetManager.assets.forEach(function (value, key) {
              console.log("\u8D44\u6E90: " + key + ", \u7C7B\u578B: " + value.constructor.name + ", \u5F15\u7528\u8BA1\u6570: " + value.refCount);
            });
          }
          console.log("\n===== Bundle 信息 =====");
          var bundleNames = [];
          // @ts-ignore - bundles 是内部实现，没有完整的类型定义
          assetManager.bundles.forEach(function (bundle, name) {
            bundleNames.push(name);
          });
          bundleNames.forEach(function (name) {
            var bundle = assetManager.getBundle(name);
            if (bundle) {
              var _assets = bundle.getDirWithPath('/');
              console.log("Bundle: " + name + ", \u8D44\u6E90\u6570: " + _assets.length);
              if (detailed) {
                _assets.forEach(function (asset) {
                  console.log("  - " + asset.path + " (" + asset.ctor.name + ")");
                });
              }
            }
          });
          if (this.loadingQueue.size > 0) {
            console.log("\n===== 正在加载的资源 =====");
            this.loadingQueue.forEach(function (item, url) {
              console.log(url + ": " + item.callbackArr.length + " \u4E2A\u56DE\u8C03\u7B49\u5F85");
            });
          }
        }

        /**
         * 获取资源统计信息
         */;
        _proto.getStats = function getStats() {
          var bundleDetails = [];
          var bundleNames = [];
          assetManager.bundles.forEach(function (bundle, name) {
            bundleNames.push(name);
          });
          bundleNames.forEach(function (name) {
            var bundle = assetManager.getBundle(name);
            if (bundle) {
              bundleDetails.push({
                name: name,
                assetCount: bundle.getDirWithPath('/').length
              });
            }
          });
          return {
            totalAssets: assetManager.assets.count,
            loadingAssets: this.loadingQueue.size,
            bundleDetails: bundleDetails
          };
        };
        _proto.parseLoadResArgs = function parseLoadResArgs(paths, type, onProgress, onComplete) {
          var pathsOut = paths;
          var typeOut = type;
          var onProgressOut = onProgress;
          var onCompleteOut = onComplete;
          if (onComplete === undefined) {
            var isValidType = js.isChildClassOf(type, Asset);
            if (onProgress) {
              onCompleteOut = onProgress;
              if (isValidType) {
                onProgressOut = null;
              }
            } else if (onProgress === undefined && !isValidType) {
              onCompleteOut = type;
              onProgressOut = null;
              typeOut = null;
            }
            if (onProgress !== undefined && !isValidType) {
              onProgressOut = type;
              typeOut = null;
            }
          }
          return {
            paths: pathsOut,
            type: typeOut,
            onProgress: onProgressOut,
            onComplete: onCompleteOut
          };
        };
        _proto.loadByBundleAndArgs = function loadByBundleAndArgs(bundle, args) {
          if (args.dir) {
            // 对于目录加载，我们需要特殊的处理
            var onCompleteDir = args.onComplete;
            bundle.loadDir(args.paths, args.type, args.onProgress, onCompleteDir);
          } else {
            if (typeof args.paths == 'string') {
              bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            } else {
              // 对于数组路径，我们需要特殊的处理
              var onCompleteArray = args.onComplete;
              bundle.load(args.paths, args.type, args.onProgress, onCompleteArray);
            }
          }
        };
        _proto.loadByArgs = function loadByArgs(args) {
          var _this3 = this;
          if (args.bundle) {
            if (assetManager.bundles.has(args.bundle)) {
              var bundle = assetManager.bundles.get(args.bundle);
              this.loadByBundleAndArgs(bundle, args);
            } else {
              // 自动加载bundle
              assetManager.loadBundle(args.bundle, function (err, bundle) {
                if (!err) {
                  _this3.loadByBundleAndArgs(bundle, args);
                }
              });
            }
          } else {
            this.loadByBundleAndArgs(resources, args);
          }
        }
        /**
         * 资源加载函数（带队列管理，避免重复加载）
         * @param url 资源路径
         * @param type 资源类型
         * @param callback 回调函数
         * @param bundle 资源包
         */;
        _proto.loadRes = function loadRes(url, type, callback, bundle) {
          var _this4 = this;
          if (bundle === void 0) {
            bundle = null;
          }
          var targetBundle = bundle || resources;

          // 检查缓存
          var cache = targetBundle.get(url, type);
          if (cache) {
            callback == null || callback(null, cache);
            return;
          }

          // 检查是否正在加载
          var loadingItem = this.loadingQueue.get(url);
          if (!loadingItem) {
            loadingItem = {
              url: url,
              isLoading: false,
              callbackArr: []
            };
            this.loadingQueue.set(url, loadingItem);
          }
          loadingItem.callbackArr.push(callback);
          if (!loadingItem.isLoading) {
            loadingItem.isLoading = true;
            targetBundle.load(url, type, function (err, asset) {
              var item = _this4.loadingQueue.get(url);
              _this4.loadingQueue["delete"](url);
              if (err) {
                error("loadRes error: " + url, err);
              } else {
                console.log("loadRes finish: " + url);
              }

              // 执行所有回调
              item == null || item.callbackArr.forEach(function (cb) {
                return cb == null ? void 0 : cb(err, asset);
              });
            });
          }
        }
        /**
         * 预加载资源
         * @param url 资源路径
         * @param type 资源类型
         * @param bundleName 资源包名
         * @param onComplete 完成回调
         */;
        _proto.preload = function preload(url, type, bundleName, onComplete) {
          var bundle = assetManager.getBundle(bundleName);
          if (!bundle) {
            assetManager.loadBundle(bundleName, function (err, loadedBundle) {
              if (err) {
                error("\u52A0\u8F7D bundle \"" + bundleName + "\" \u5931\u8D25", err);
                onComplete == null || onComplete(err);
              } else {
                loadedBundle.preload(url, type, onComplete);
              }
            });
          } else {
            bundle.preload(url, type, onComplete);
          }
        }

        /**
         * 异步预加载资源
         * @param item 预加载项
         */;
        _proto.preloadAsync = function preloadAsync(item) {
          var _this5 = this;
          return new Promise(function (resolve, reject) {
            _this5.preload(item.url, item.type, item.bundleName, function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        }

        /**
         * 批量异步预加载资源
         * @param items 预加载项数组
         * @param onProgress 进度回调 (当前完成数, 总数, 当前项)
         * @example
         * const items = [
         *     { url: 'prefab1', type: Prefab, bundleName: 'game' },
         *     { url: 'prefab2', type: Prefab, bundleName: 'game' }
         * ];
         * await ResLoader.ins.preloadBatch(items, (finished, total, item) => {
         *     console.log(`预加载进度: ${finished}/${total} - ${item.url}`);
         * });
         */;
        _proto.preloadBatch = /*#__PURE__*/
        function () {
          var _preloadBatch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(items, onProgress) {
            var total, finished, _iterator, _step, _item;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  total = items.length;
                  finished = 0;
                  _iterator = _createForOfIteratorHelperLoose(items);
                case 3:
                  if ((_step = _iterator()).done) {
                    _context.next = 19;
                    break;
                  }
                  _item = _step.value;
                  _context.prev = 5;
                  _context.next = 8;
                  return this.preloadAsync(_item);
                case 8:
                  finished++;
                  onProgress == null || onProgress(finished, total, _item);
                  _context.next = 17;
                  break;
                case 12:
                  _context.prev = 12;
                  _context.t0 = _context["catch"](5);
                  finished++;
                  console.error("\u9884\u52A0\u8F7D\u5931\u8D25: " + _item.url, _context.t0);
                  onProgress == null || onProgress(finished, total, _item);
                case 17:
                  _context.next = 3;
                  break;
                case 19:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[5, 12]]);
          }));
          function preloadBatch(_x, _x2) {
            return _preloadBatch.apply(this, arguments);
          }
          return preloadBatch;
        }()
        /**
         * 批量异步预加载资源（并发模式）
         * @param items 预加载项数组
         * @param onProgress 进度回调 (当前完成数, 总数)
         * @param concurrent 并发数量，默认为 3
         * @example
         * await ResLoader.ins.preloadBatchConcurrent(items, (finished, total) => {
         *     console.log(`预加载进度: ${finished}/${total}`);
         * }, 5);
         */;

        _proto.preloadBatchConcurrent = /*#__PURE__*/
        function () {
          var _preloadBatchConcurrent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(items, onProgress, concurrent) {
            var _this6 = this;
            var total, finished, index, loadNext, tasks, i;
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  if (concurrent === void 0) {
                    concurrent = 3;
                  }
                  total = items.length;
                  finished = 0;
                  index = 0;
                  loadNext = /*#__PURE__*/function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
                      var currentIndex, _item2;
                      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                        while (1) switch (_context2.prev = _context2.next) {
                          case 0:
                            if (!(index < items.length)) {
                              _context2.next = 17;
                              break;
                            }
                            currentIndex = index++;
                            _item2 = items[currentIndex];
                            _context2.prev = 3;
                            _context2.next = 6;
                            return _this6.preloadAsync(_item2);
                          case 6:
                            _context2.next = 11;
                            break;
                          case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2["catch"](3);
                            console.error("\u9884\u52A0\u8F7D\u5931\u8D25: " + _item2.url, _context2.t0);
                          case 11:
                            _context2.prev = 11;
                            finished++;
                            onProgress == null || onProgress(finished, total);
                            return _context2.finish(11);
                          case 15:
                            _context2.next = 0;
                            break;
                          case 17:
                          case "end":
                            return _context2.stop();
                        }
                      }, _callee2, null, [[3, 8, 11, 15]]);
                    }));
                    return function loadNext() {
                      return _ref.apply(this, arguments);
                    };
                  }(); // 创建并发任务
                  tasks = [];
                  for (i = 0; i < Math.min(concurrent, items.length); i++) {
                    tasks.push(loadNext());
                  }
                  _context3.next = 9;
                  return Promise.all(tasks);
                case 9:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          }));
          function preloadBatchConcurrent(_x3, _x4, _x5) {
            return _preloadBatchConcurrent.apply(this, arguments);
          }
          return preloadBatchConcurrent;
        }();
        _createClass(ResLoader, null, [{
          key: "ins",
          get: /** 单例实例 */
          function get() {
            if (this._instance == null) {
              this._instance = new ResLoader();
            }
            return this._instance;
          }
        }]);
        return ResLoader;
      }());
      ResLoader._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SingtonClass.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5da0eLDzh9LYqi9VzunfEUk", "SingtonClass", undefined);
      /**
       * @description
       * 单例模式基类
       */
      var SingtonClass = /*#__PURE__*/function () {
        function SingtonClass() {}
        SingtonClass.getInstance = function getInstance() {
          if (!this.instance) {
            this.instance = new this();
          }
          return this.instance;
        };
        return SingtonClass;
      }();
      var SingletonMgr = exports('SingletonMgr', SingtonClass);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/start.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameSound.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, sys, profiler, Component, GameSound;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      sys = module.sys;
      profiler = module.profiler;
      Component = module.Component;
    }, function (module) {
      GameSound = module.GameSound;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "c251fdiim5EAo/Fi5hmasX3", "start", undefined);
      var ccclass = _decorator.ccclass;
      var err = {};
      function handleError(errorMessage, file, line, message, error) {
        if (!err[errorMessage]) {
          var stackStr = new Error().stack;
          console.trace("上报错误", stackStr, errorMessage, file, line, message, error);
          // M.http.postError(JSON.stringify({ err: errorMessage }))
          err[errorMessage] = errorMessage;
        }
      }
      if (sys.isNative) {
        var __handler = null;
        if (window['__errorHandler']) {
          __handler = window['__errorHandler'];
        }
        window['__errorHandler'] = function (errorMessage, file, line, message, error) {
          // my.log('游戏报错,原生系统')
          handleError(errorMessage, file, line, message, error);
          if (__handler) {
            __handler(errorMessage, file, line, message, error);
          }
        };
      }
      if (sys.isBrowser) {
        var _handler = null;
        if (window.onerror) {
          _handler = window.onerror;
        }
        window.onerror = function (errorMessage, file, line, message, error) {
          // my.log('游戏报错,浏览器')
          handleError(errorMessage, file, line, message, error);
          if (_handler) {
            _handler(errorMessage, file, line, message, error);
          }
        };
        window.addEventListener('unhandledrejection', function (event) {
          // console.error(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
          handleError(event.reason, '', 0, '', event.reason);
        });
      }
      profiler.showStats();
      var start = exports('start', (_dec = ccclass('start'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(start, _Component);
        function start() {
          return _Component.apply(this, arguments) || this;
        }
        var _proto = start.prototype;
        _proto.start = function start() {
          GameSound.getInstance().playMusic('bgm');
        };
        return start;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StorageManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './EncryptUtil.ts', './env'], function (exports) {
  var _createClass, cclegacy, sys, EncryptUtil, PREVIEW;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      EncryptUtil = module.EncryptUtil;
    }, function (module) {
      PREVIEW = module.PREVIEW;
    }],
    execute: function () {
      cclegacy._RF.push({}, "717dbwucsFGOoc5nXsw3ESE", "StorageManager", undefined);
      var StorageManager = exports('StorageManager', /*#__PURE__*/function () {
        function StorageManager() {
          this._key = null;
          this._iv = null;
          this._id = null;
        }
        var _proto = StorageManager.prototype;
        /**
         * 初始化密钥
         * @param key aes加密的key 
         * @param iv  aes加密的iv
         */
        _proto.init = function init(key, iv) {
          EncryptUtil.initCrypto(key, iv);
          this._key = EncryptUtil.md5(key);
          this._iv = EncryptUtil.md5(iv);
        }

        /**
         * 设置用户唯一标识
         * @param id 
         */;
        _proto.setUser = function setUser(id) {
          this._id = id;
        }

        /**
         * 存储本地数据
         * @param key 存储key
         * @param value 存储值
         * @returns 
         */;
        _proto.set = function set(key, value) {
          var keywords = this.getKey(key);
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          if (this.encrypted) {
            keywords = EncryptUtil.md5(keywords);
          }
          if (null == value) {
            console.warn("存储的值为空，则直接移除该存储");
            this.remove(key);
            return;
          }
          if (typeof value === 'function') {
            console.error("储存的值不能为方法");
            return;
          }
          if (typeof value === 'object') {
            try {
              value = JSON.stringify(value);
            } catch (e) {
              console.error("\u89E3\u6790\u5931\u8D25\uFF0Cstr = " + value);
              return;
            }
          } else if (typeof value === 'number') {
            value = value + "";
          }
          if (this.encrypted && null != this._key && null != this._iv) {
            value = EncryptUtil.aesEncrypt("" + value, this._key, this._iv);
          }
          sys.localStorage.setItem(keywords, value);
        }

        /**
         * 获取指定关键字的数据
         * @param key          获取的关键字
         * @param defaultValue 获取的默认值
         * @returns 
         */;
        _proto.get = function get(key, defaultValue) {
          if (defaultValue === void 0) {
            defaultValue = "";
          }
          if (null == key) {
            console.error("存储的key不能为空");
            return null;
          }
          key = this.getKey(key);
          if (this.encrypted) {
            key = EncryptUtil.md5(key);
          }
          var str = sys.localStorage.getItem(key);
          if (null != str && '' !== str && this.encrypted && null != this._key && null != this._iv) {
            str = EncryptUtil.aesDecrypt(str, this._key, this._iv);
          }
          if (null === str) {
            return defaultValue;
          }
          return str;
        }

        /** 获取指定关键字的数值 */;
        _proto.getNumber = function getNumber(key, defaultValue) {
          if (defaultValue === void 0) {
            defaultValue = 0;
          }
          var r = this.get(key);
          if (r == "0") {
            return Number(r);
          }
          return Number(r) || defaultValue;
        }

        /** 获取指定关键字的布尔值 */;
        _proto.getBoolean = function getBoolean(key) {
          var r = this.get(key);
          return Boolean(r) || false;
        }

        /** 获取指定关键字的JSON对象 */;
        _proto.getJson = function getJson(key, defaultValue) {
          var r = this.get(key);
          return r && JSON.parse(r) || defaultValue;
        }

        /**
         * 删除指定关键字的数据
         * @param key 需要移除的关键字
         * @returns 
         */;
        _proto.remove = function remove(key) {
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          var keywords = this.getKey(key);
          if (this.encrypted) {
            keywords = EncryptUtil.md5(keywords);
          }
          sys.localStorage.removeItem(keywords);
        }

        /** 清空整个本地存储 */;
        _proto.clear = function clear() {
          sys.localStorage.clear();
        }

        /** 获取数据分组关键字 */;
        _proto.getKey = function getKey(key) {
          if (this._id == null || this._id == "") {
            return key;
          }
          return this._id + "_" + key;
        }

        /** 数据加密开关 */;
        _createClass(StorageManager, [{
          key: "encrypted",
          get: function get() {
            return !PREVIEW;
          }
        }], [{
          key: "ins",
          get: function get() {
            if (this._instance == null) {
              this._instance = new StorageManager();
            }
            return this._instance;
          }
        }]);
        return StorageManager;
      }());
      StorageManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SucDialog.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './PopupBase.ts', './Logger.ts', './MessageManager.ts', './GameEvent.ts', './GameSound.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, PopupBase, Logger, message, GameEventEnum, GameSound;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      PopupBase = module.PopupBase;
    }, function (module) {
      Logger = module.default;
    }, function (module) {
      message = module.message;
    }, function (module) {
      GameEventEnum = module.GameEventEnum;
    }, function (module) {
      GameSound = module.GameSound;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "0c6b1eJHchLwayeiYM56bFZ", "SucDialog", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var SucDialog = exports('SucDialog', (_dec = ccclass('SucDialog'), _dec(_class = /*#__PURE__*/function (_PopupBase) {
        _inheritsLoose(SucDialog, _PopupBase);
        function SucDialog() {
          return _PopupBase.apply(this, arguments) || this;
        }
        var _proto = SucDialog.prototype;
        _proto.onLoad = function onLoad() {
          _PopupBase.prototype.onLoad.call(this);
        };
        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {}

        /**
        * 第一次创建将会在onLoad之前创建，后续将会在onEnable之前执行
        * @param data 传入数据
        */;
        _proto.init = function init(data) {};
        _proto.onBtnNextLv = function onBtnNextLv(event) {
          // Tween.stopAllByTarget(event.target as Node)
          // tween(event.target as Node)
          //     .by(0.1, { scale: v3(0.9, 0.9, 0.9) })
          //     .by(0.1, { scale: v3(1.0, 1.0, 1.0) })
          //     .start();
          GameSound.getInstance().playEffect('click');
          Logger.warn('点击了下一关');
          message.dispatchEvent(GameEventEnum.nextLv);
          this.hideUI();
        };
        _proto.onBtnBackHome = function onBtnBackHome(event) {
          GameSound.getInstance().playEffect('click');
          message.dispatchEvent(GameEventEnum.backHome);
          Logger.warn('点击了返回首页');
          this.hideUI();
        };
        return SucDialog;
      }(PopupBase)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Sudoku.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "3df0c7VfRhLXJ1c3on+2z6J", "Sudoku", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var Sudoku = exports('Sudoku', (_dec = ccclass('Sudoku'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Sudoku, _Component);
        function Sudoku() {
          return _Component.apply(this, arguments) || this;
        }
        var _proto = Sudoku.prototype;
        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {};
        return Sudoku;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ToastMgr.ts", ['cc', './PoolManager.ts', './ResLoader.ts'], function (exports) {
  var cclegacy, _decorator, UIOpacity, Tween, tween, v3, Label, UITransform, Prefab, instantiate, Node, BlockInputEvents, poolMgr, ResLoader;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      UIOpacity = module.UIOpacity;
      Tween = module.Tween;
      tween = module.tween;
      v3 = module.v3;
      Label = module.Label;
      UITransform = module.UITransform;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      Node = module.Node;
      BlockInputEvents = module.BlockInputEvents;
    }, function (module) {
      poolMgr = module.poolMgr;
    }, function (module) {
      ResLoader = module.ResLoader;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2b12as/RalGqLUSu6P8kF5m", "ToastMgr", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var ToastMgr = exports('ToastMgr', /*#__PURE__*/function () {
        function ToastMgr() {
          /** 文本提示容器 */
          this.txtContent = void 0;
          this._startY = 120;
          this.max = 2;
          this._prefab = null;
          this._H = 46;
          /** 飘字请求队列 */
          this.toastQueue = [];
          /** 是否正在处理飘字请求 */
          this.isProcessing = false;
          this.txtContent = new Node();
          var uit = this.txtContent.addComponent(UITransform);
          this.txtContent.addComponent(BlockInputEvents);
          uit.setContentSize(800, 0);
          this.txtContent.setPosition(0, this._startY);
        }
        var _proto = ToastMgr.prototype;
        _proto.configure = function configure(node, txt, posY, delayTime) {
          var t = this;
          var opacityCom = node.getComponent(UIOpacity);
          if (!opacityCom) {
            opacityCom = node.addComponent(UIOpacity);
          }
          opacityCom.opacity = 255;
          Tween.stopAllByTarget(opacityCom);
          Tween.stopAllByTarget(t.txtContent);

          // 设置新节点的初始位置及特效
          node.setPosition(0, 0);
          tween(node).to(0.05, {
            scale: v3(1.1, 1.1, 1.1)
          }).delay(0.05).to(0.05, {
            scale: v3(1, 1, 1)
          }).start();
          //设置旧节点的位置及特效
          var nums = t.txtContent.children.length;
          if (nums > 0) {
            if (nums >= t.max) {
              var _node = t.txtContent.children[0];
              if (_node.isValid) {
                t.txtContent.removeChild(_node);
                nums -= 1;
              }
            }
            for (var i = nums - 1; i >= 0; --i) {
              var targetPosition = v3(0, (nums - i - 1) * t._H);
              var currentNode = t.txtContent.children[i];
              var pos = targetPosition;
              t.txtContent.children[i].setPosition(pos);
              tween(currentNode).to(0.1, {
                position: v3(0, pos.y + t._H)
              }).start();
            }
          }
          var labNode = node.getChildByName("lab");
          labNode.active = true;
          labNode.getComponent(Label).string = txt;
          t.txtContent.addChild(node);
          var uit = t.txtContent.getComponent(UITransform);
          uit.setContentSize(800, t.txtContent.children.length * t._H);
          t.txtContent.setPosition(v3(0, t._startY));
          tween(opacityCom).delay(0.7).to(1, {
            opacity: 55
          }).call(function () {
            t.txtRemove(opacityCom);
          }).start();
        };
        _proto.txtRemove = function txtRemove(opacityCom) {
          poolMgr.putNode(opacityCom.node);
          Tween.stopAllByTarget(opacityCom);
        };
        _proto.processQueue = function processQueue() {
          var _this = this;
          if (this.isProcessing) return;
          this.isProcessing = true;
          var processNext = function processNext() {
            if (_this.toastQueue.length === 0) {
              _this.isProcessing = false;
              return;
            }
            var _ref = _this.toastQueue.shift(),
              txt = _ref.txt,
              posY = _ref.posY,
              delayTime = _ref.delayTime;
            _this.make(txt, posY, delayTime);
            // 设置0.1秒后处理下一个请求
            setTimeout(processNext, 150);
          };
          processNext();
        };
        _proto.tweenCall = function tweenCall() {
          var content = this.txtContent;
          Tween.stopAllByTarget(content);
          content.removeAllChildren();
          if (content.parent) {
            content.parent.removeChild(content);
          }
        };
        _proto.make = function make(txt, posY, delayTime) {
          if (!txt || txt.length <= 0) return;
          var t = this;
          var tip = null;
          {
            if (!t._prefab) {
              ResLoader.ins.loadRes('comm/toastUI', Prefab, function (err, data) {
                if (err) {
                  console.error('加载toastUI预制体失败:', err);
                  return;
                }
                t._prefab = data;
                t.configure(instantiate(t._prefab), txt, posY, delayTime);
              });
              return;
            } else {
              // 获取对象池
              tip = poolMgr.getNode(this._prefab, null);
            }
          }
          if (tip) t.configure(tip, txt, posY, delayTime);
        }

        /**
         * 显示提示
         * @param txt 提示内容
         * @param posY 提示位置
         * @param delayTime 延迟时间
         * @param skillid 技能id
         */;
        _proto.showToast = function showToast(txt, posY, delayTime, skillid) {
          if (posY === void 0) {
            posY = 0;
          }
          if (delayTime === void 0) {
            delayTime = 1.5;
          }
          if (skillid === void 0) {
            skillid = null;
          }
          this.toastQueue.push({
            txt: txt,
            posY: posY,
            delayTime: delayTime,
            skillid: skillid
          });
          this.processQueue(); //队列处理
        };

        _proto.clear = function clear() {
          //清理对象池
          // poolMgr.clearPool(this._prefab.name);
        };
        return ToastMgr;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/toastUI.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Label, Sprite, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Sprite = module.Sprite;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "c2616kUcb9Mbaks3EQ6zAX0", "toastUI", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var toastUI = exports('toastUI', (_dec = ccclass('toastUI'), _dec2 = property(Label), _dec3 = property(Sprite), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(toastUI, _Component);
        function toastUI() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "m_lab", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "m_bg", _descriptor2, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = toastUI.prototype;
        _proto.start = function start() {};
        _proto.update = function update(deltaTime) {};
        return toastUI;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "m_lab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "m_bg", [_dec3], {
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

System.register("chunks:///_virtual/utls.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createClass, cclegacy;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "df610ENt9JHrIuoPRpN7z2R", "utls", undefined);
      var Utils = /*#__PURE__*/function () {
        function Utils() {}
        var _proto = Utils.prototype;
        /**
         * 把秒转为分:秒格式
         * @param sec 秒数（支持小数，会自动向下取整）
         * @returns 格式化的时间字符串，如 "10:00", "9:59"
         * @example
         * secToMin(600)    // "10:00"
         * secToMin(599)    // "9:59"
         * secToMin(65.8)   // "1:05"
         * secToMin(5.2)    // "0:05"
         */
        _proto.secToMin = function secToMin(sec) {
          var totalSeconds = Math.floor(sec);
          var minutes = Math.floor(totalSeconds / 60);
          var seconds = totalSeconds % 60;
          return minutes + ":" + seconds.toString().padStart(2, '0');
        };
        _createClass(Utils, null, [{
          key: "inst",
          get: function get() {
            if (!this._inst) {
              this._inst = new Utils();
            }
            return this._inst;
          }
        }]);
        return Utils;
      }();
      Utils._inst = null;
      var utils = exports('utils', Utils.inst);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Vehicle.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, _createClass, cclegacy, _decorator, Sprite, UITransform, tween, Vec3, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      UITransform = module.UITransform;
      tween = module.tween;
      Vec3 = module.Vec3;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "a1b2cPU5fZ4kKvN7xI0VniQ", "Vehicle", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var VehicleType = exports('VehicleType', /*#__PURE__*/function (VehicleType) {
        VehicleType[VehicleType["POLICE"] = 0] = "POLICE";
        VehicleType[VehicleType["OBSTACLE"] = 1] = "OBSTACLE";
        VehicleType[VehicleType["CAR"] = 2] = "CAR";
        return VehicleType;
      }({}));
      var Direction = exports('Direction', /*#__PURE__*/function (Direction) {
        Direction[Direction["HORIZONTAL"] = 0] = "HORIZONTAL";
        Direction[Direction["VERTICAL"] = 1] = "VERTICAL";
        return Direction;
      }({}));
      var Vehicle = exports('Vehicle', (_dec = ccclass('Vehicle'), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec4 = property(Sprite), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Vehicle, _Component);
        function Vehicle() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "vehicleType", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "width", _descriptor2, _assertThisInitialized(_this));
          // 车辆宽度（格子数）
          _initializerDefineProperty(_this, "height", _descriptor3, _assertThisInitialized(_this));
          // 车辆高度（格子数）
          _initializerDefineProperty(_this, "gridX", _descriptor4, _assertThisInitialized(_this));
          // 网格X坐标
          _initializerDefineProperty(_this, "gridY", _descriptor5, _assertThisInitialized(_this));
          // 网格Y坐标
          _initializerDefineProperty(_this, "cattle", _descriptor6, _assertThisInitialized(_this));
          // 
          _initializerDefineProperty(_this, "wolf", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "sheep", _descriptor8, _assertThisInitialized(_this));
          _this.m_parentSize = null;
          _this.m_direction = Direction.HORIZONTAL;
          _this.cellWidth = 100;
          _this.cellHeight = 100;
          return _this;
        }
        var _proto = Vehicle.prototype;
        _proto.start = function start() {
          this.updateDirection();
          this.updateVisual();
        }

        // 初始化车辆
        ;

        _proto.init = function init(type, w, h, x, y, cellWidth, cellHeight, parentSize) {
          this.vehicleType = type;
          this.width = w;
          this.height = h;
          this.gridX = x;
          this.gridY = y;
          this.cellWidth = cellWidth;
          this.cellHeight = cellHeight;
          this.m_parentSize = parentSize;
          if (w > h) {
            for (var index = 0; index < this.node.children.length; index++) {
              var anim = this.node.children[index];
              anim.angle = 90;
            }
            // this.node.children[0].angle = 90;
            this.direction = Direction.HORIZONTAL;
          } else {
            for (var _index = 0; _index < this.node.children.length; _index++) {
              var _anim = this.node.children[_index];
              _anim.angle = 0;
            }
            // this.node.children[0].angle = 0;
            this.direction = Direction.VERTICAL;
          }
          this.updateCar();
          this.updateDirection();
          this.updateVisual();
          this.updatePosition(false);
        };
        _proto.updateCar = function updateCar() {
          if (this.vehicleType == VehicleType.POLICE) {
            this.cattle.node.active = false;
            this.sheep.node.active = false;
            this.wolf.node.active = true;
          } else {
            if (this.width == 3 || this.height == 3) {
              this.cattle.node.active = true;
              this.sheep.node.active = false;
            } else {
              this.cattle.node.active = false;
              this.sheep.node.active = true;
            }
            // this.cattle.node.active = true;
            this.wolf.node.active = false;
          }
        } // this.updateVisual();

        // 更新方向
        ;

        _proto.updateDirection = function updateDirection() {
          this.direction = this.width > this.height ? Direction.HORIZONTAL : Direction.VERTICAL;
          console.log("Vehicle (" + this.vehicleType + ") size: " + this.width + "x" + this.height + ", direction: " + (this.direction === Direction.HORIZONTAL ? 'HORIZONTAL' : 'VERTICAL'));
        }

        // 更新视觉效果
        ;

        _proto.updateVisual = function updateVisual() {
          var sprite = this.node.getComponent(Sprite);

          // 设置节点大小
          var transform = this.node.getComponent(UITransform);
          if (transform) {
            transform.width = this.width * this.cellWidth;
            transform.height = this.height * this.cellHeight;
          }
        }

        // 更新位置
        ;

        _proto.updatePosition = function updatePosition(animated) {
          if (animated === void 0) {
            animated = true;
          }
          var worldX = (this.gridX + this.width / 2) * this.cellWidth;
          var worldY = (this.gridY + this.height / 2) * this.cellHeight;
          if (animated) {
            tween(this.node).to(0.2, {
              position: new Vec3(worldX - this.m_parentSize.width * 0.5, worldY - this.m_parentSize.height * 0.5, 0)
            }).start();
          } else {
            this.node.setPosition(worldX - this.m_parentSize.width * 0.5, worldY - this.m_parentSize.height * 0.5, 0);
          }
        }

        // 移动车辆
        ;

        _proto.move = function move(deltaX, deltaY) {
          this.gridX += deltaX;
          this.gridY += deltaY;
          this.updatePosition(true);
          return true;
        }

        // 旋转车辆90度
        ;

        _proto.rotate = function rotate() {
          if (this.vehicleType === VehicleType.OBSTACLE) {
            return false; // 障碍物不能旋转
          }

          // 交换宽高
          var temp = this.width;
          this.width = this.height;
          this.height = temp;
          this.updateDirection();
          this.updateVisual();
          this.updatePosition(true);
          return true;
        }

        // 检查是否可以移动到指定位置
        ;

        _proto.canMoveTo = function canMoveTo(newX, newY, gridWidth, gridHeight) {
          // 检查边界
          if (newX < 0 || newY < 0 || newX + this.width > gridWidth || newY + this.height > gridHeight) {
            return false;
          }
          return true;
        }

        // 获取车辆占据的所有格子
        ;

        _proto.getOccupiedCells = function getOccupiedCells() {
          var cells = [];
          for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
              cells.push({
                x: this.gridX + i,
                y: this.gridY + j
              });
            }
          }
          return cells;
        }

        // 检查是否在出口位置
        ;

        _proto.isAtExit = function isAtExit(exitX, exitY) {
          if (this.vehicleType !== VehicleType.POLICE) {
            return false;
          }

          // 检查警车是否在出口的同一行或同一列
          var cells = this.getOccupiedCells();
          for (var _iterator = _createForOfIteratorHelperLoose(cells), _step; !(_step = _iterator()).done;) {
            var cell = _step.value;
            if (cell.x === exitX && cell.y === exitY) {
              return true;
            }
          }
          return false;
        };
        _createClass(Vehicle, [{
          key: "direction",
          get:
          //水平移动

          function get() {
            return this.m_direction;
          },
          set: function set(value) {
            this.m_direction = value;
          }
        }]);
        return Vehicle;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "vehicleType", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return VehicleType.CAR;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "width", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "height", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gridX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "gridY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cattle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "wolf", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "sheep", [_dec4], {
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
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
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