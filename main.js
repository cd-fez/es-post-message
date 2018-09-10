'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _componentEmitter = require('component-emitter');

var _componentEmitter2 = _interopRequireDefault(_componentEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Messenger = require('./messenger.js');

var EsMessenger = function (_Emitter) {
  _inherits(EsMessenger, _Emitter);

  function EsMessenger(options) {
    _classCallCheck(this, EsMessenger);

    var _this = _possibleConstructorReturn(this, (EsMessenger.__proto__ || Object.getPrototypeOf(EsMessenger)).call(this));

    _this.name = options.name;
    _this.project = options.project;
    _this.children = options.children;
    _this.type = options.type; //enum: parent,child
    _this.setup();
    return _this;
  }

  _createClass(EsMessenger, [{
    key: 'setup',
    value: function setup() {
      var _this2 = this;

      var messenger = new Messenger(this.name, this.project);
      if (this.type == 'child') {
        //同时广播同域和者跨域
        messenger.addTarget(window.parent, 'parent');
        messenger.addTarget(window.self, 'partner');
      } else if (this.type == 'parent') {
        messenger.addTarget(window.self, 'child');
        var children = this.children;
        for (var i = children.length - 1; i >= 0; i--) {
          messenger.addTarget(children[i].contentWindow, children[i].id);
        }
      }

      messenger.listen(function (msg) {
        msg = JSON.parse(msg);
        _this2.emit(msg.eventName, msg.args);
      });
      this.messenger = messenger;
    }
  }, {
    key: 'sendToParent',
    value: function sendToParent(eventName, args) {
      for (var target in this.messenger.targets) {
        this.messenger.targets[target].send(this.convertToString(eventName, args));
      }
    }
  }, {
    key: 'sendToChild',
    value: function sendToChild(child, eventName, args) {
      this.messenger.targets[child.id].send(this.convertToString(eventName, args));
    }
  }, {
    key: 'convertToString',
    value: function convertToString(eventName, args) {
      var msg = { 'eventName': eventName, 'args': args };
      msg = JSON.stringify(msg);
      return msg;
    }
  }]);

  return EsMessenger;
}(_componentEmitter2.default);

exports.default = EsMessenger;
