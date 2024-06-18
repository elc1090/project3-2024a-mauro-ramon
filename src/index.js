import dotenv       from 'dotenv';              //.env
import express      from 'express';             //api framework
import swaggerUi    from 'swagger-ui-express';  //swagger UI endpoint for express
import morgan       from 'morgan';              //HTTP logger
import pino         from 'pino';                //error and info logger
import cors 		from 'cors';
import fs           from 'fs';                  //JS built in file system

import { estoqueRouter } from './routes/estoqueRouter.js';

//info, error, critical logger
export const logger = pino({
	level : 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
			ignore: 'pid,hostname',
		}
	}
});

try
{
	//load .env
	dotenv.config();

	//express router
	const server = express();
		
	//use json middleware to allow json encoded requisition body
	server.use(express.json());

	//use urlencoded middleware to allow encoded url in requisitions
	server.use(express.urlencoded({extended : true}));

	//use HTTP logger middleware, common apache format
	server.use(morgan('common'));

	server.use(cors());

	//server port
	const port = process.env.PORT;

	//serve api-doc endpoint based on auto generated swagger-file
	//if the file does not exist, the program is not terminated but
	// the endpoint is not served
	try
	{
		const swaggerFile = fs.readFileSync('./doc/swagger.json', 'utf-8')
		server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerFile)));
	} 
	catch (error)
	{
		logger.warn("Could not find documentation file, /api-doc not available.");
	}

	//hello world page
	server.get('/', async (req, res) => {
		res.status(200).send('<h3 style="text-align:center">Hello World!</h3>');
	})

	server.use('/estoque', estoqueRouter);
	
	//not found page
	server.all('*', async (req, res) => { 
		res.status(404).send(
			`<h3 style="text-align:center">404! Page not found.</h3>
			<p style="text-align:center">Please verify your URI</p>`
		); 
	}); 
	
	//server startup
	server.listen(port, () => logger.info(`Server running on port ${port}`));
} 
catch (error)
{
	logger.fatal(error.message);
	process.exit(1);
}