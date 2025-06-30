--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-06-04 09:25:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 66137)
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    id_cita bigint NOT NULL,
    id_usuario bigint,
    id_vehiculo bigint,
    fecha_hora timestamp without time zone NOT NULL,
    descripcion character varying(255),
    estado character varying(50) DEFAULT 'Pendiente'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_conversacion bigint,
    CONSTRAINT citas_estado_check CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'Asignada'::character varying, 'En Proceso'::character varying, 'Finalizada'::character varying, 'Cancelada'::character varying])::text[])))
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 66136)
-- Name: citas_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.citas_id_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.citas_id_cita_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 219
-- Name: citas_id_cita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citas_id_cita_seq OWNED BY public.citas.id_cita;


--
-- TOC entry 227 (class 1259 OID 66204)
-- Name: conversaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversaciones (
    id_conversacion bigint NOT NULL,
    id_usuario1 bigint,
    id_usuario2 bigint,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.conversaciones OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 66203)
-- Name: conversaciones_id_conversacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversaciones_id_conversacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversaciones_id_conversacion_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 226
-- Name: conversaciones_id_conversacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversaciones_id_conversacion_seq OWNED BY public.conversaciones.id_conversacion;


--
-- TOC entry 225 (class 1259 OID 66190)
-- Name: facturas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facturas (
    id_factura bigint NOT NULL,
    id_cita bigint,
    monto_total numeric(10,0) NOT NULL,
    fecha_emision timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado_pago character varying(50),
    CONSTRAINT facturas_estado_pago_check CHECK (((estado_pago)::text = ANY ((ARRAY['Pagado'::character varying, 'Pendiente'::character varying, 'Cancelado'::character varying])::text[])))
);


ALTER TABLE public.facturas OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 66189)
-- Name: facturas_id_factura_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facturas_id_factura_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facturas_id_factura_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 224
-- Name: facturas_id_factura_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facturas_id_factura_seq OWNED BY public.facturas.id_factura;


--
-- TOC entry 221 (class 1259 OID 66158)
-- Name: mecanicos_citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mecanicos_citas (
    id_mecanico bigint NOT NULL,
    id_cita bigint NOT NULL
);


ALTER TABLE public.mecanicos_citas OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 66224)
-- Name: mensajes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mensajes (
    id_mensaje bigint NOT NULL,
    id_conversacion bigint,
    id_remitente bigint,
    contenido character varying(255) NOT NULL,
    fecha_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    leido boolean DEFAULT false
);


ALTER TABLE public.mensajes OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 66223)
-- Name: mensajes_id_mensaje_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mensajes_id_mensaje_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mensajes_id_mensaje_seq OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 228
-- Name: mensajes_id_mensaje_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mensajes_id_mensaje_seq OWNED BY public.mensajes.id_mensaje;


--
-- TOC entry 223 (class 1259 OID 66174)
-- Name: seguimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimiento (
    id_seguimiento bigint NOT NULL,
    id_cita bigint,
    descripcion character varying(255) NOT NULL,
    imagen_url character varying(255),
    estado character varying(50),
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT seguimiento_estado_check CHECK (((estado)::text = ANY ((ARRAY['En Proceso'::character varying, 'Pieza Cambiada'::character varying, 'Finalizado'::character varying])::text[])))
);


ALTER TABLE public.seguimiento OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 66173)
-- Name: seguimiento_id_seguimiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seguimiento_id_seguimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguimiento_id_seguimiento_seq OWNER TO postgres;

--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 222
-- Name: seguimiento_id_seguimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seguimiento_id_seguimiento_seq OWNED BY public.seguimiento.id_seguimiento;


--
-- TOC entry 216 (class 1259 OID 66110)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    contrasena character varying(255) NOT NULL,
    telefono character varying(15),
    tipo_usuario character varying(50),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    foto_perfil character varying(200),
    token character varying(200),
    CONSTRAINT usuarios_tipo_usuario_check CHECK (((tipo_usuario)::text = ANY ((ARRAY['Cliente'::character varying, 'Mecanico'::character varying, 'Administrador'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 66109)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 215
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 218 (class 1259 OID 66123)
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    id_vehiculo bigint NOT NULL,
    id_usuario bigint,
    marca character varying(50) NOT NULL,
    modelo character varying(50) NOT NULL,
    matricula character varying(20) NOT NULL,
    ano_fabricacion integer,
    tipo_motor character varying(50)
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 66122)
-- Name: vehiculos_id_vehiculo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehiculos_id_vehiculo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculos_id_vehiculo_seq OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 217
-- Name: vehiculos_id_vehiculo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehiculos_id_vehiculo_seq OWNED BY public.vehiculos.id_vehiculo;


--
-- TOC entry 4772 (class 2604 OID 66524)
-- Name: citas id_cita; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas ALTER COLUMN id_cita SET DEFAULT nextval('public.citas_id_cita_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 66578)
-- Name: conversaciones id_conversacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversaciones ALTER COLUMN id_conversacion SET DEFAULT nextval('public.conversaciones_id_conversacion_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 66675)
-- Name: facturas id_factura; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas ALTER COLUMN id_factura SET DEFAULT nextval('public.facturas_id_factura_seq'::regclass);


--
-- TOC entry 4781 (class 2604 OID 66592)
-- Name: mensajes id_mensaje; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes ALTER COLUMN id_mensaje SET DEFAULT nextval('public.mensajes_id_mensaje_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 66569)
-- Name: seguimiento id_seguimiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento ALTER COLUMN id_seguimiento SET DEFAULT nextval('public.seguimiento_id_seguimiento_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 66331)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4771 (class 2604 OID 66508)
-- Name: vehiculos id_vehiculo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos ALTER COLUMN id_vehiculo SET DEFAULT nextval('public.vehiculos_id_vehiculo_seq'::regclass);


--
-- TOC entry 4976 (class 0 OID 66137)
-- Dependencies: 220
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.citas (id_cita, id_usuario, id_vehiculo, fecha_hora, descripcion, estado, fecha_creacion, id_conversacion) FROM stdin;
7	4	9	2025-06-04 09:09:42.315	Ruedas	Finalizada	2025-06-04 09:19:24.443	6
5	6	5	2025-05-25 10:16:20.795	Le hace un ruido en el motor y los frenos	Finalizada	2025-05-27 19:34:46.737	4
6	7	6	2025-05-27 19:16:46.796	Revisión pre-ITVs	Finalizada	2025-05-27 19:44:34.471	5
\.


--
-- TOC entry 4983 (class 0 OID 66204)
-- Dependencies: 227
-- Data for Name: conversaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversaciones (id_conversacion, id_usuario1, id_usuario2, fecha_creacion) FROM stdin;
2	4	2	2025-05-24 15:39:25.842
4	6	2	2025-05-25 10:15:42.16
5	7	2	2025-05-27 19:16:42.46
6	4	2	2025-06-04 09:09:42.336
\.


--
-- TOC entry 4981 (class 0 OID 66190)
-- Dependencies: 225
-- Data for Name: facturas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facturas (id_factura, id_cita, monto_total, fecha_emision, estado_pago) FROM stdin;
4	5	250	2025-05-25 10:29:41.274	Pagado
6	5	140	2025-05-27 19:44:31.073	Pendiente
7	6	1231451	2025-05-27 19:44:52.091	Pendiente
9	7	400	2025-06-04 09:20:06.334	Pagado
\.


--
-- TOC entry 4977 (class 0 OID 66158)
-- Dependencies: 221
-- Data for Name: mecanicos_citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mecanicos_citas (id_mecanico, id_cita) FROM stdin;
2	5
2	6
2	7
\.


--
-- TOC entry 4985 (class 0 OID 66224)
-- Dependencies: 229
-- Data for Name: mensajes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mensajes (id_mensaje, id_conversacion, id_remitente, contenido, fecha_envio, leido) FROM stdin;
3	4	6	Buenas, podrías revisarle los filtros al coche	2025-05-25 10:28:35.361	t
4	4	2	Si, los revisaré	2025-05-25 10:28:56.273	t
7	2	2	como estas	2025-05-27 19:34:00.196	t
6	2	4	hola	2025-05-27 19:33:56.38	t
5	5	7	Hola	2025-05-27 19:17:45.899	t
\.


--
-- TOC entry 4979 (class 0 OID 66174)
-- Dependencies: 223
-- Data for Name: seguimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seguimiento (id_seguimiento, id_cita, descripcion, imagen_url, estado, fecha_actualizacion) FROM stdin;
20	7	Recogida de coche para mantenimiento	/files/seguimientos/1749021513594_ChatGPT Image 1 jun 2025, 23_54_27.png	Finalizado	2025-06-04 09:19:26.55
21	7	Cambio de ruedas	/files/seguimientos/1749021590172_ChatGPT Image 1 jun 2025, 23_41_45.png	Finalizado	2025-06-04 09:19:50.185
22	7	Revisar presiones	/files/seguimientos/1749021598362_ChatGPT Image 1 jun 2025, 23_45_37.png	Finalizado	2025-06-04 09:19:58.375
7	5	Recogida de coche para mantenimiento	\N	Finalizado	2025-05-27 19:44:21.53
8	5	Revisar el motor	\N	Finalizado	2025-05-27 19:44:21.932
9	5	Revisar los frenos	\N	Finalizado	2025-05-27 19:44:22.267
11	5	Cambio de frenos 	\N	Finalizado	2025-05-27 19:44:22.629
12	5	Añadir aditivo al aceite	\N	Finalizado	2025-05-27 19:44:22.959
13	5	Revisar Filtros 	\N	Finalizado	2025-05-27 19:44:23.42
14	6	Recogida de coche para mantenimiento	\N	Finalizado	2025-05-27 19:44:47.665
15	6	Revisar Liquidiquidos	\N	Finalizado	2025-05-27 19:44:48.023
16	6	Revisar Bombillas	\N	Finalizado	2025-05-27 19:44:48.321
17	6	Revisar filtros	\N	Finalizado	2025-05-27 19:44:48.687
18	6	PRE -ITV	\N	Finalizado	2025-05-27 19:44:49.042
\.


--
-- TOC entry 4972 (class 0 OID 66110)
-- Dependencies: 216
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre, email, contrasena, telefono, tipo_usuario, fecha_registro, foto_perfil, token) FROM stdin;
0	Admin	Admin	$2a$10$7DRgApo/dxxgiLvbETXDNu.cbS6W7L9frXbEdqVd/D0/piA10l.Oy	622021568	Administrador	2025-05-24 15:32:52.674	\N	\N
2	Mecanico	mecanico1@correo.com	$2a$10$TZRP1PwYcibhD88D4I.OuOf/aeSDa4FHa.PdiEWdoOPEym6tkly5y	123456789	Mecanico	2025-05-24 15:37:25.973	\N	\N
3	Mecanico2	mecanico2@correo.com	$2a$10$BIf3jiMJxcYjrUbZVuwoQusffgqIJR7C865nhwKLNDp6WLHR0Dz.2	12314	Mecanico	2025-05-24 15:37:42.715	\N	\N
4	Usuarios1	usuarios1@correo.com	$2a$10$v2SYIRoqLUSD.3ivtFGBburNLGmSUgwKslf9Q9547mg14.L5latH.	1234567	Cliente	2025-05-24 15:38:07.109	\N	\N
7	Jonathan	jonathan@correo.com	$2a$10$xlILVUKRL5YGisxBqEljcu.umwOtIVGiPbDbhQRp3aSpLyXu.Q89S	622021568	Cliente	2025-05-27 19:12:51.162	\N	\N
6	PruebaUsuario	pruebauser@correo.com	$2a$10$Wi7SwyyKQsNMKGFiW9QsxOjFBHIH.ZUht.SNUQBEkoyneS6g9GbSa	622021568	Mecanico	2025-05-25 10:14:25.437	\N	\N
\.


--
-- TOC entry 4974 (class 0 OID 66123)
-- Dependencies: 218
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehiculos (id_vehiculo, id_usuario, marca, modelo, matricula, ano_fabricacion, tipo_motor) FROM stdin;
5	6	Peugeot 	206	0444HRM	1998	Gasolina
6	7	Dacia	SENDERO STEPWAY	2682MNS	2023	Gasolina
9	4	Honda	Civic	1234RMH	1999	Gasolina
\.


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 219
-- Name: citas_id_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.citas_id_cita_seq', 7, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 226
-- Name: conversaciones_id_conversacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversaciones_id_conversacion_seq', 6, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 224
-- Name: facturas_id_factura_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facturas_id_factura_seq', 9, true);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 228
-- Name: mensajes_id_mensaje_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mensajes_id_mensaje_seq', 7, true);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 222
-- Name: seguimiento_id_seguimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seguimiento_id_seguimiento_seq', 22, true);


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 215
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 7, true);


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 217
-- Name: vehiculos_id_vehiculo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehiculos_id_vehiculo_seq', 9, true);


--
-- TOC entry 4801 (class 2606 OID 66526)
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id_cita);


--
-- TOC entry 4811 (class 2606 OID 66580)
-- Name: conversaciones conversaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversaciones
    ADD CONSTRAINT conversaciones_pkey PRIMARY KEY (id_conversacion);


--
-- TOC entry 4808 (class 2606 OID 66677)
-- Name: facturas facturas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id_factura);


--
-- TOC entry 4804 (class 2606 OID 66624)
-- Name: mecanicos_citas mecanicos_citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos_citas
    ADD CONSTRAINT mecanicos_citas_pkey PRIMARY KEY (id_mecanico, id_cita);


--
-- TOC entry 4815 (class 2606 OID 66594)
-- Name: mensajes mensajes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes
    ADD CONSTRAINT mensajes_pkey PRIMARY KEY (id_mensaje);


--
-- TOC entry 4806 (class 2606 OID 66571)
-- Name: seguimiento seguimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento
    ADD CONSTRAINT seguimiento_pkey PRIMARY KEY (id_seguimiento);


--
-- TOC entry 4789 (class 2606 OID 66273)
-- Name: usuarios ukkfsp0s1tflm1cwlj8idhqsad0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT ukkfsp0s1tflm1cwlj8idhqsad0 UNIQUE (email);


--
-- TOC entry 4795 (class 2606 OID 66275)
-- Name: vehiculos ukwidpc0i9uotdrlq5xxlklr0d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT ukwidpc0i9uotdrlq5xxlklr0d UNIQUE (matricula);


--
-- TOC entry 4791 (class 2606 OID 66121)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4793 (class 2606 OID 66333)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4797 (class 2606 OID 66130)
-- Name: vehiculos vehiculos_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_matricula_key UNIQUE (matricula);


--
-- TOC entry 4799 (class 2606 OID 66510)
-- Name: vehiculos vehiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (id_vehiculo);


--
-- TOC entry 4802 (class 1259 OID 66244)
-- Name: idx_citas_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_citas_estado ON public.citas USING btree (estado);


--
-- TOC entry 4809 (class 1259 OID 66245)
-- Name: idx_facturas_estado_pago; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_facturas_estado_pago ON public.facturas USING btree (estado_pago);


--
-- TOC entry 4812 (class 1259 OID 66246)
-- Name: idx_mensajes_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mensajes_fecha ON public.mensajes USING btree (fecha_envio);


--
-- TOC entry 4813 (class 1259 OID 66247)
-- Name: idx_mensajes_leido; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mensajes_leido ON public.mensajes USING btree (leido);


--
-- TOC entry 4817 (class 2606 OID 66639)
-- Name: citas citas_id_conversacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_id_conversacion_fkey FOREIGN KEY (id_conversacion) REFERENCES public.conversaciones(id_conversacion) ON DELETE SET NULL;


--
-- TOC entry 4818 (class 2606 OID 66344)
-- Name: citas citas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4819 (class 2606 OID 66511)
-- Name: citas citas_id_vehiculo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_id_vehiculo_fkey FOREIGN KEY (id_vehiculo) REFERENCES public.vehiculos(id_vehiculo) ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 66349)
-- Name: conversaciones conversaciones_id_usuario1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversaciones
    ADD CONSTRAINT conversaciones_id_usuario1_fkey FOREIGN KEY (id_usuario1) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4825 (class 2606 OID 66354)
-- Name: conversaciones conversaciones_id_usuario2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversaciones
    ADD CONSTRAINT conversaciones_id_usuario2_fkey FOREIGN KEY (id_usuario2) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4823 (class 2606 OID 66547)
-- Name: facturas facturas_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas
    ADD CONSTRAINT facturas_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.citas(id_cita) ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 66614)
-- Name: mecanicos_citas mecanicos_citas_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos_citas
    ADD CONSTRAINT mecanicos_citas_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.citas(id_cita) ON DELETE CASCADE;


--
-- TOC entry 4821 (class 2606 OID 66625)
-- Name: mecanicos_citas mecanicos_citas_id_mecanico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mecanicos_citas
    ADD CONSTRAINT mecanicos_citas_id_mecanico_fkey FOREIGN KEY (id_mecanico) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4826 (class 2606 OID 66601)
-- Name: mensajes mensajes_id_conversacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes
    ADD CONSTRAINT mensajes_id_conversacion_fkey FOREIGN KEY (id_conversacion) REFERENCES public.conversaciones(id_conversacion) ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 66359)
-- Name: mensajes mensajes_id_remitente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes
    ADD CONSTRAINT mensajes_id_remitente_fkey FOREIGN KEY (id_remitente) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4822 (class 2606 OID 66557)
-- Name: seguimiento seguimiento_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento
    ADD CONSTRAINT seguimiento_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.citas(id_cita) ON DELETE CASCADE;


--
-- TOC entry 4816 (class 2606 OID 66372)
-- Name: vehiculos vehiculos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


-- Completed on 2025-06-04 09:25:48

--
-- PostgreSQL database dump complete
--

