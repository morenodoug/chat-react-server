
CREATE TABLE "user"
(
  id serial NOT NULL,
  email character varying NOT NULL,
  name character varying NOT NULL,
  password character varying NOT NULL,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_email_key UNIQUE (email)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "user"
  OWNER TO postgres;
