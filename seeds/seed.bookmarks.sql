TRUNCATE bookmarks RESTART IDENTITY CASCADE;

INSERT INTO bookmarks ( 
	title, 
	description, 
	url, 
	rating) 
VALUES 
(
	'Google', 
	'Well-known search engine', 
	'https://www.google.com',
	5
), 
(
	'Microsoft .NET', 
	'Microsoft''s .NET documentation and training website', 
	'https://dotnet.microsoft.com/', 
	5
), 
(
	'Nodejs',
	'Nodejs official website', 
	'https://nodejs.org/en/', 
	5
), 
(
	'PostgreSQL official website', 
	'PostgreSQL: The World''s Most Advanced Open Source Relational Database',
	'https://www.postgresql.org/',
	4
), 
(
	'Reactjs website', 
	'React - A JavaScript library for building user interfaces', 
	'https://reactjs.org/', 
	5
), 
(
	'Smashing Magazine', 
	'Web design magazine with tons of articles', 
	'https://www.smashingmagazine.com/', 
	4
), 
(
	'Bootstrap official website', 
	'Build responsive, mobile-first projects on the web with the world�s most popular front-end component library.', 
	'https://getbootstrap.com/', 
	5
), 
(
	'Material Design official website', 
	'Material is a design system � backed by open-source code � that helps teams build high-quality digital experiences.', 
	'https://material.io/', 
	4
), 
(
	'Google Fonts', 
	'Making the web more beautiful, fast, and open through great typography.', 
	'https://fonts.google.com/', 
	5
), 
(
	'Coolors color palette generator', 
	'The super fast color schemes generator. Create, save and share perfect palettes in seconds', 
	'https://coolors.co/', 
	5
);
