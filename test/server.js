'use strict';

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
require('dotenv').config();
var api_1 = require("./modules/api");
var app = express_1.default();
var port = process.env.PORT || 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'src', 'public')));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '..', 'src', 'views'));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var topCoins;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Retrieving initial essential data...');
                return [4 /*yield*/, api_1.initializeData()];
            case 1:
                topCoins = _a.sent();
                console.log('Top 20 loaded, loading more details of the top 20 now...');
                return [4 /*yield*/, Promise.all(topCoins.map(function (c) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, c.refreshData()];
                    }); }); }))];
            case 2:
                _a.sent();
                app.get('/', function (req, res) {
                    res.render('overview', { coins: topCoins, public: '/' });
                });
                app.get('/coin/:id', function (req, res) {
                    var coin = topCoins.find(function (c) { return c.id === req.params.id; });
                    if (!coin)
                        return res.sendStatus(404);
                    var tr = coin.markets.map(function (m) {
                        return {
                            'Exchange': m.exchange_name,
                            'Pair': m.pair,
                            'Name': m.base_currency_name,
                            'Quote currency': m.quote_currency_name,
                            '24h volume': "" + m.quotes[Object.keys(m.quotes)[0]].volume_24h.toFixed(2)
                        };
                    });
                    var th = Object.keys(tr[0]);
                    var table = { headers: th, rows: tr };
                    res.render('detail', {
                        coin: coin,
                        table: table,
                        public: '../../'
                    });
                });
                app.listen(port, function () {
                    console.log("server is running on port " + port);
                });
                return [2 /*return*/];
        }
    });
}); })();
