import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import express, { Express, Request, Response } from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import FileStore from 'session-file-store';
import flash from 'express-flash';

// import router
import thoughtRouter from './routes/thoughtRoutes';

const AppFileStore: FileStore.FileStore = FileStore(session);

dotenv.config();
const app: Express = express();
const port: number = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.resolve(process.cwd(), 'public')));

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(
	session({
		name: 'session',
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: false,
		store: new AppFileStore({
			logFn: function () {},
			path: path.join(os.tmpdir(), 'sessions'),
		}),
		cookie: {
			secure: false,
			maxAge: 7200000,
			httpOnly: true,
		},
	})
);

app.use((req, res, next) => {
	if (req.session && (req.session as any).user?.id) {
		res.locals.session = req.session;
	}

	next();
});

app.use(flash());

// routes
app.use('/', thoughtRouter);
app.use('/thought', thoughtRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}...`);
});
