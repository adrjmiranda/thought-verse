import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import express, { Express } from 'express';
import { engine, create } from 'express-handlebars';
import session from 'express-session';
import FileStore from 'session-file-store';
import flash from 'express-flash';

// import router
import thoughtRouter from './routes/thoughtRoutes';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import { CustomSession } from './interfaces/CustomSession';

const AppFileStore: FileStore.FileStore = FileStore(session);

dotenv.config();
const app: Express = express();
const port: number = 3000;

app.engine(
	'handlebars',
	engine({
		extname: 'handlebars',
		defaultLayout: 'main',
		partialsDir: './views/partials',
		layoutsDir: './views/layouts',
		helpers: {
			equals: function (
				variableOne: string | number,
				variableTwo: string | number
			) {
				if (variableOne == variableTwo) {
					return true;
				} else {
					return false;
				}
			},
			format_date: function (date: string) {
				const newDate = new Date(date);

				const options: Intl.DateTimeFormatOptions = {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				};
				const formattedDate = newDate.toLocaleDateString('en-US', options);

				return formattedDate;
			},
		},
	})
);
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(express.static('public'));

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
	if (req.session && (req.session as CustomSession).user?.id) {
		res.locals.session = req.session;
	}

	next();
});

app.use(flash());

// routes
app.use('/', thoughtRouter);
app.use('/thought', thoughtRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}...`);
});
