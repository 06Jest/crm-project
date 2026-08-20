set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "service_role";

create extension "pg_cron";

create sequence "public"."profile_display_id_seq" as bigint increment by 1 minvalue 1 maxvalue 9223372036854775807 START with 1 cache 1 no cycle;

create table "public"."activities" (
  "id"          uuid                     not null default gen_random_uuid(),
  "org_id"      uuid                     not null,
  "lead_id"     uuid,
  "contact_id"  uuid,
  "customer_id" uuid,
  "created_by"  uuid                     not null,
  "type"        text                     not null,
  "action"      text                     not null,
  "title"       text                     not null,
  "description" text,
  "created_at"  timestamp with time zone not null default now(),
  "updated_at"  timestamp with time zone not null default now(),
  "deleted_at"  timestamp with time zone,
  "target_name" text,
  constraint "activities_action_check"
    check ((action = ANY (ARRAY['created'::text, 'updated'::text, 'deleted'::text, 'assigned'::text, 'completed'::text, 'cancelled'::text, 'started'::text, 'sent'::text]))),
  constraint "activities_pkey" primary key (id),
  constraint "activities_target_type_check"
    check
    ((type = ANY (ARRAY['meeting'::text, 'visit'::text, 'follow_up'::text, 'other'::text, 'lead'::text, 'contact'::text, 'deal'::text, 'customer'::text, 'task'::text, 'call'::text,
    'note'::text, 'sms'::text, 'email'::text, 'system'::text])))
);

alter table "public"."activities"
  enable row level security;

create table "public"."calls" (
  "id"               uuid                     not null default gen_random_uuid(),
  "org_id"           uuid                     not null,
  "lead_id"          uuid,
  "contact_id"       uuid,
  "created_by"       uuid                     not null,
  "assigned_to"      uuid                     not null,
  "subject"          text                     not null,
  "notes"            character varying(5000),
  "type"             text                     not null,
  "status"           text                     not null default 'scheduled'::text,
  "outcome"          text,
  "priority"         text                     not null default 'medium'::text,
  "scheduled_for"    timestamp with time zone,
  "started_at"       timestamp with time zone,
  "ended_at"         timestamp with time zone,
  "duration_seconds" integer,
  "created_at"       timestamp with time zone not null default now(),
  "updated_at"       timestamp with time zone not null default now(),
  "deleted_at"       timestamp with time zone,
  "direction"        text                     not null default 'outbound'::text,
  constraint "calls_direction_check" check ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text]))),
  constraint "calls_outcome_check"
    check (((outcome IS NULL) OR (outcome = ANY (ARRAY['interested'::text, 'not_interested'::text, 'callback_requested'::text, 'resolved'::text, 'other'::text])))),
  constraint "calls_owner_check" check ((((lead_id IS NOT NULL) AND (contact_id IS NULL)) OR ((lead_id IS NULL) AND (contact_id IS NOT NULL)))),
  constraint "calls_pkey" primary key (id),
  constraint "calls_priority_check" check ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
  constraint "calls_status_check" check ((status = ANY (ARRAY['scheduled'::text, 'dialing'::text, 'ringing'::text, 'active'::text, 'completed'::text, 'cancelled'::text]))),
  constraint "calls_type_check" check ((type = ANY (ARRAY['sales'::text, 'follow_up'::text, 'support'::text, 'demo'::text, 'onboarding'::text, 'renewal'::text, 'other'::text])))
);

alter table "public"."calls"
  enable row level security;

create table "public"."contacts" (
  "id"                     uuid                     not null default gen_random_uuid(),
  "email"                  text,
  "phone"                  text,
  "company_name"           text                     not null default 'not provided'::text,
  "position"               text                     not null default 'not provided'::text,
  "status"                 text                     not null default 'Lead'::text,
  "owner_id"               uuid                     not null,
  "org_id"                 uuid                     not null,
  "created_at"             timestamp with time zone default now(),
  "updated_at"             timestamp with time zone default now(),
  "owner_name"             text                     not null default ''::text,
  "first_name"             text                     not null,
  "last_name"              text                     not null,
  "suffix"                 text,
  "gender"                 text                     not null default 'Prefer not to say'::text,
  "birth_date"             date,
  "department"             text,
  "priority"               text                     not null default 'Low'::text,
  "notes"                  character varying(5000),
  "source"                 text                     not null default 'Other'::text,
  "lead_id"                uuid,
  "deleted_at"             timestamp with time zone,
  "deleted_by"             uuid,
  "updated_by"             uuid,
  "linkedin"               character varying(100),
  "facebook"               character varying(100),
  "instagram"              character varying(100),
  "tiktok"                 character varying(100),
  "x"                      character varying(100),
  "telegram"               character varying(100),
  "whatsapp"               character varying(20),
  "viber"                  character varying(20),
  "industry"               character varying(100),
  "website"                text,
  "address"                text,
  "city"                   character varying(100),
  "country"                character varying(100),
  "latitude"               numeric(10,8),
  "longitude"              numeric(11,8),
  "preferred_contact_time" text                     default '''Anytime'''::text,
  constraint "chk_contact_address" check (((address IS NULL) OR (address = ''::text) OR (length(TRIM(BOTH FROM address)) > 0))),
  constraint "chk_contact_city" check (((city IS NULL) OR ((city)::text = ''::text) OR (length(TRIM(BOTH FROM city)) > 0))),
  constraint "chk_contact_country" check (((country IS NULL) OR ((country)::text = ''::text) OR (length(TRIM(BOTH FROM country)) > 0))),
  constraint "chk_contact_latitude" check (((latitude IS NULL) OR ((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric)))),
  constraint "chk_contact_longitude" check (((longitude IS NULL) OR ((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric)))),
  constraint "chk_contact_website" check (((website IS NULL) OR (website = ''::text) OR (length(TRIM(BOTH FROM website)) > 0))),
  constraint "contacts_company_name_length_check" check ((char_length(company_name) <= 255)),
  constraint "contacts_department_length_check" check ((char_length(department) <= 100)),
  constraint "contacts_email_length_check" check ((char_length(email) <= 254)),
  constraint "contacts_email_or_phone_required" check (((email IS NOT NULL) OR (phone IS NOT NULL))),
  constraint "contacts_facebook_check" check (((facebook IS NULL) OR ((TRIM(BOTH FROM facebook) = (facebook)::text) AND ((facebook)::text ~ '^[A-Za-z0-9._-]{2,100}$'::text)))),
  constraint "contacts_first_name_length_check" check ((char_length(first_name) <= 100)),
  constraint "contacts_gender_length_check" check ((char_length(gender) <= 30)),
  constraint "contacts_gender_values_check" check ((gender = ANY (ARRAY['Male'::text, 'Female'::text, 'Prefer not to say'::text]))),
  constraint "contacts_industry_length_check" check (((industry IS NULL) OR (char_length(TRIM(BOTH FROM industry)) <= 100))),
  constraint "contacts_instagram_check"
    check (((instagram IS NULL) OR ((TRIM(BOTH FROM instagram) = (instagram)::text) AND ((instagram)::text ~ '^[A-Za-z0-9._-]{2,100}$'::text)))),
  constraint "contacts_last_name_length_check" check ((char_length(last_name) <= 100)),
  constraint "contacts_linkedin_check" check (((linkedin IS NULL) OR ((TRIM(BOTH FROM linkedin) = (linkedin)::text) AND ((linkedin)::text ~ '^[A-Za-z0-9._-]{2,100}$'::text)))),
  constraint "contacts_notes_length_check" check ((char_length((notes)::text) <= 5000)),
  constraint "contacts_owner_name_length_check" check ((char_length(owner_name) <= 100)),
  constraint "contacts_phone_length_check" check ((char_length(phone) <= 30)),
  constraint "contacts_pkey" primary key (id),
  constraint "contacts_position_length_check" check ((char_length("position") <= 100)),
  constraint "contacts_preferred_contact_time_check"
    check
    (((preferred_contact_time IS NULL) OR (preferred_contact_time = ANY (ARRAY[('Morning'::character varying)::text, ('Afternoon'::character varying)::text, ('Evening'::character
    varying)::text, ('Anytime'::character varying)::text])))),
  constraint "contacts_priority_length_check" check ((char_length(priority) <= 20)),
  constraint "contacts_priority_values_check" check ((priority = ANY (ARRAY['Low'::text, 'High'::text, 'Highest'::text]))),
  constraint "contacts_source_length_check" check ((char_length(source) <= 50)),
  constraint "contacts_source_values_check"
    check
    ((source = ANY (ARRAY['Website'::text, 'Referral'::text, 'Facebook'::text, 'Instagram'::text, 'LinkedIn'::text, 'Google Search'::text, 'Google Ads'::text,
    'Email Campaign'::text,
    'Cold Call'::text,
    'Trade Show'::text,
    'Webinar'::text,
    'Partner'::text,
    'Walk-in'::text,
    'WhatsApp'::text,
    'Messenger'::text, 'Personal Network'::text, 'Direct Conversation'::text, 'Networking Event'::text, 'Conference'::text, 'Friend'::text, 'Family'::text, 'Other'::text]))),
  constraint "contacts_suffix_length_check" check ((char_length(suffix) <= 20)),
  constraint "contacts_telegram_check" check (((telegram IS NULL) OR ((TRIM(BOTH FROM telegram) = (telegram)::text) AND ((telegram)::text ~ '^[A-Za-z0-9._-]{2,100}$'::text)))),
  constraint "contacts_tiktok_check" check (((tiktok IS NULL) OR ((TRIM(BOTH FROM tiktok) = (tiktok)::text) AND ((tiktok)::text ~ '^[A-Za-z0-9._-]{2,100}$'::text)))),
  constraint "contacts_viber_check" check (((viber IS NULL) OR ((viber)::text ~ '^\+?[0-9]{7,15}$'::text))),
  constraint "contacts_whatsapp_check" check (((whatsapp IS NULL) OR ((whatsapp)::text ~ '^\+?[0-9]{7,15}$'::text))),
  constraint "contacts_x_check" check (((x IS NULL) OR ((TRIM(BOTH FROM x) = (x)::text) AND ((x)::text ~ '^[A-Za-z0-9._-]{2,100}$'::text))))
);

alter table "public"."contacts"
  enable row level security;

create table "public"."conversation_members" (
  "id"              uuid                     not null default gen_random_uuid(),
  "conversation_id" uuid                     not null,
  "member_id"       uuid                     not null,
  "joined_at"       timestamp with time zone not null default now(),
  "last_read_at"    timestamp with time zone,
  constraint "conversation_members_conversation_id_profile_id_key" unique (conversation_id, member_id),
  constraint "conversation_members_pkey" primary key (id)
);

alter table "public"."conversation_members"
  enable row level security;

create table "public"."conversations" (
  "id"              uuid                     not null default gen_random_uuid(),
  "org_id"          uuid                     not null,
  "type"            text                     not null,
  "created_by"      uuid                     not null,
  "created_at"      timestamp with time zone not null default now(),
  "updated_at"      timestamp with time zone not null default now(),
  "deleted_at"      timestamp with time zone,
  "last_message_id" uuid,
  "industry"        text,
  constraint "conversations_pkey" primary key (id),
  constraint "conversations_type_check" check ((type = ANY (ARRAY['announcement'::text, 'organization'::text, 'direct'::text])))
);

alter table "public"."conversations"
  enable row level security;

create table "public"."customers" (
  "id"         uuid                     not null default gen_random_uuid(),
  "contact_id" uuid                     not null,
  "notes"      text,
  "status"     character varying(20)    not null default 'Active'::character varying,
  "owner_id"   uuid                     not null,
  "org_id"     uuid                     not null,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "deleted_at" timestamp with time zone,
  "deleted_by" uuid,
  "updated_by" uuid,
  constraint "chk_customer_status"
    check (((status)::text = ANY ((ARRAY['Active'::character varying, 'Inactive'::character varying, 'At Risk'::character varying, 'Churned'::character varying])::text[]))),
  constraint "customers_notes_length_check" check ((char_length(notes) <= 5000)),
  constraint "customers_pkey" primary key (id)
);

alter table "public"."customers"
  enable row level security;

create table "public"."deals" (
  "id"         uuid                     not null default gen_random_uuid(),
  "contact_id" uuid                     not null,
  "title"      character varying(150)   not null,
  "stage"      text                     not null,
  "notes"      character varying(5000),
  "owner_id"   uuid                     not null,
  "org_id"     uuid                     not null,
  "value"      numeric(12,2)            not null default 0,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone default now(),
  "close_date" timestamp with time zone,
  "closed_by"  uuid,
  "deleted_at" timestamp with time zone,
  "deleted_by" uuid,
  "updated_by" uuid,
  constraint "deals_pkey" primary key (id),
  constraint "deals_stage_check" check ((stage = ANY (ARRAY['Prospecting'::text, 'Proposal'::text, 'Negotiation'::text, 'Closed Won'::text, 'Closed Lost'::text]))),
  constraint "deals_value_check" check ((value >= (0)::numeric))
);

alter table "public"."deals"
  enable row level security;

create table "public"."emails" (
  "id"                  uuid                     not null default gen_random_uuid(),
  "org_id"              uuid                     not null,
  "sender_id"           uuid                     not null,
  "lead_id"             uuid,
  "contact_id"          uuid,
  "customer_id"         uuid,
  "recipient_email"     text                     not null,
  "subject"             text                     not null,
  "provider"            text                     not null default 'resend'::text,
  "provider_message_id" text,
  "error_message"       text,
  "sent_at"             timestamp with time zone,
  "created_at"          timestamp with time zone not null default now(),
  "updated_at"          timestamp with time zone not null default now(),
  "deleted_at"          timestamp with time zone,
  "sender_name"         text                     not null default ''::text,
  "sender_email"        text                     not null default ''::text,
  "body_text"           text                     not null default ''::text,
  "preview_text"        text                     not null default ''::text,
  "body_html"           text,
  constraint "emails_body_text_length_check" check ((char_length(body_text) <= 5000)),
  constraint "emails_pkey" primary key (id),
  constraint "emails_provider_check" check ((provider = 'resend'::text)),
  constraint "emails_single_owner_check" check ((((((lead_id IS NOT NULL))::integer + ((contact_id IS NOT NULL))::integer) + ((customer_id IS NOT NULL))::integer) = 1))
);

alter table "public"."emails"
  enable row level security;

create table "public"."feedbacks" (
  "id"         uuid                     not null default gen_random_uuid(),
  "name"       text,
  "email"      text,
  "rating"     smallint,
  "message"    text                     not null,
  "created_at" timestamp with time zone not null default now(),
  "user_type"  text                     not null default 'prefer_not_to_say'::text,
  constraint "feedback_message_check" check (((char_length(TRIM(BOTH FROM message)) >= 1) AND (char_length(TRIM(BOTH FROM message)) <= 1000))),
  constraint "feedback_pkey" primary key (id),
  constraint "feedback_rating_check" check (((rating IS NULL) OR ((rating >= 1) AND (rating <= 5)))),
  constraint "feedback_user_type_check" check ((user_type = ANY (ARRAY['everyday_user'::text, 'manager'::text, 'technical'::text, 'prefer_not_to_say'::text])))
);

alter table "public"."feedbacks"
  enable row level security;

create table "public"."leads" (
  "id"                     uuid                     not null default gen_random_uuid(),
  "first_name"             text                     not null,
  "last_name"              text,
  "suffix"                 text,
  "gender"                 text                     not null default 'Prefer not to say'::text,
  "birth_date"             date,
  "email"                  text,
  "phone"                  text,
  "company_name"           text,
  "department"             text,
  "position"               text,
  "status"                 text                     not null default 'New'::text,
  "owner_id"               uuid                     not null,
  "org_id"                 uuid                     not null,
  "notes"                  character varying(5000),
  "priority"               text                     not null default 'Low'::text,
  "created_at"             timestamp with time zone default now(),
  "updated_at"             timestamp with time zone default now(),
  "title"                  text                     not null,
  "source"                 text                     not null default 'Other'::text,
  "deleted_at"             timestamp with time zone,
  "deleted_by"             uuid,
  "updated_by"             uuid,
  "industry"               character varying(100),
  "linkedin"               character varying(255),
  "facebook"               character varying(255),
  "instagram"              character varying(255),
  "tiktok"                 character varying(255),
  "x"                      character varying(255),
  "whatsapp"               character varying(50),
  "telegram"               character varying(100),
  "viber"                  character varying(50),
  "preferred_contact_time" character varying(20),
  "website"                text,
  constraint "leads_company_name_length_check" check ((char_length(company_name) <= 100)),
  constraint "leads_department_length_check" check ((char_length(department) <= 100)),
  constraint "leads_email_length_check" check ((char_length(email) <= 254)),
  constraint "leads_first_name_length_check" check ((char_length(first_name) <= 50)),
  constraint "leads_gender_length_check" check ((char_length(gender) <= 30)),
  constraint "leads_gender_values_check" check ((gender = ANY (ARRAY['Male'::text, 'Female'::text, 'Prefer not to say'::text]))),
  constraint "leads_last_name_length_check" check ((char_length(last_name) <= 50)),
  constraint "leads_notes_length_check" check ((char_length((notes)::text) <= 5000)),
  constraint "leads_phone_length_check" check ((char_length(phone) <= 25)),
  constraint "leads_pkey" primary key (id),
  constraint "leads_position_length_check" check ((char_length("position") <= 100)),
  constraint "leads_preferred_contact_time_check"
    check
    (((preferred_contact_time IS NULL) OR ((preferred_contact_time)::text = ANY ((ARRAY['Morning'::character varying, 'Afternoon'::character varying, 'Evening'::character varying,
    'Anytime'::character varying])::text[])))),
  constraint "leads_priority_length_check" check ((char_length(priority) <= 20)),
  constraint "leads_priority_values_check" check ((priority = ANY (ARRAY['Low'::text, 'High'::text, 'Highest'::text]))),
  constraint "leads_source_length_check" check ((char_length(source) <= 50)),
  constraint "leads_source_values_check"
    check
    ((source = ANY (ARRAY['Website'::text, 'Referral'::text, 'Facebook'::text, 'Instagram'::text, 'LinkedIn'::text, 'Google Search'::text, 'Google Ads'::text,
    'Email Campaign'::text,
    'Cold Call'::text,
    'Trade Show'::text,
    'Webinar'::text,
    'Partner'::text,
    'Walk-in'::text,
    'WhatsApp'::text,
    'Messenger'::text, 'Personal Network'::text, 'Direct Conversation'::text, 'Networking Event'::text, 'Conference'::text, 'Friend'::text, 'Family'::text, 'Other'::text]))),
  constraint "leads_status_values_check" check ((status = ANY (ARRAY['New'::text, 'Contacted'::text, 'Qualified'::text, 'Closed'::text]))),
  constraint "leads_suffix_length_check" check ((char_length(suffix) <= 10)),
  constraint "leads_title_length_check" check ((char_length(title) <= 100))
);

alter table "public"."leads"
  enable row level security;

create table "public"."messages" (
  "id"              uuid                     not null default gen_random_uuid(),
  "conversation_id" uuid                     not null,
  "sender_id"       uuid                     not null,
  "content"         text                     not null,
  "entity_type"     text,
  "entity_id"       uuid,
  "created_at"      timestamp with time zone not null default now(),
  "updated_at"      timestamp with time zone not null default now(),
  "edited_at"       timestamp with time zone,
  "deleted_at"      timestamp with time zone,
  constraint "messages_check" check ((((entity_type IS NULL) AND (entity_id IS NULL)) OR ((entity_type IS NOT NULL) AND (entity_id IS NOT NULL)))),
  constraint "messages_content_check" check ((btrim(content) <> ''::text)),
  constraint "messages_content_length_check" check ((char_length(content) <= 5000)),
  constraint "messages_entity_type_check" check ((entity_type = ANY (ARRAY['lead'::text, 'contact'::text, 'deal'::text, 'customer'::text]))),
  constraint "messages_pkey" primary key (id)
);

alter table "public"."messages"
  enable row level security;

create table "public"."notes" (
  "id"          uuid                     not null default gen_random_uuid(),
  "org_id"      uuid                     not null,
  "author_id"   uuid                     not null,
  "target_type" character varying(20)    not null,
  "target_id"   uuid,
  "content"     text                     not null,
  "visibility"  character varying(20)    not null default 'private'::character varying,
  "created_at"  timestamp with time zone not null default now(),
  "updated_at"  timestamp with time zone not null default now(),
  "deleted_at"  timestamp with time zone,
  "deleted_by"  uuid,
  "updated_by"  uuid,
  "title"       text                     not null default ''::text,
  "pinned"      boolean                  not null default false,
  constraint "notes_content_length_check" check ((char_length(content) <= 5000)),
  constraint "notes_pkey" primary key (id),
  constraint "notes_target_type_check"
    check
    (((target_type)::text = ANY ((ARRAY['lead'::character varying, 'contact'::character varying, 'deal'::character varying, 'customer'::character varying, 'personal'::character
    varying])::text[]))),
  constraint "notes_visibility_check" check (((visibility)::text = ANY ((ARRAY['public'::character varying, 'private'::character varying])::text[])))
);

alter table "public"."notes"
  enable row level security;

create table "public"."organization_invite_acceptances" (
  "id"          uuid                     not null default gen_random_uuid(),
  "invite_id"   uuid                     not null,
  "profile_id"  uuid                     not null,
  "accepted_at" timestamp with time zone not null default now(),
  constraint "organization_invite_acceptances_invite_id_profile_id_key" unique (invite_id, profile_id),
  constraint "organization_invite_acceptances_pkey" primary key (id)
);

alter table "public"."organization_invite_acceptances"
  enable row level security;

create table "public"."organization_invites" (
  "id"         uuid                     not null default gen_random_uuid(),
  "org_id"     uuid                     not null,
  "code"       text                     not null,
  "role"       text                     not null,
  "email"      text,
  "max_uses"   integer                  not null default 1,
  "used_count" integer                  not null default 0,
  "status"     text                     not null default 'active'::text,
  "expires_at" timestamp with time zone not null,
  "created_by" uuid                     not null,
  "created_at" timestamp with time zone not null default now(),
  constraint "organization_invites_max_uses_check" check ((max_uses > 0)),
  constraint "organization_invites_pkey" primary key (id),
  constraint "organization_invites_role_check" check ((role = ANY (ARRAY['owner'::text, 'manager'::text, 'agent'::text]))),
  constraint "organization_invites_status_check" check ((status = ANY (ARRAY['active'::text, 'completed'::text, 'expired'::text, 'revoked'::text]))),
  constraint "organization_invites_usage_check" check ((used_count <= max_uses)),
  constraint "organization_invites_used_count_check" check ((used_count >= 0))
);

alter table "public"."organization_invites"
  enable row level security;

create table "public"."organization_member_counters" (
  "id"            uuid                     not null default gen_random_uuid(),
  "org_id"        uuid                     not null,
  "owner_count"   integer                  not null default 0,
  "manager_count" integer                  not null default 0,
  "agent_count"   integer                  not null default 0,
  "created_at"    timestamp with time zone default now(),
  "updated_at"    timestamp with time zone default now(),
  constraint "organization_member_counters_org_id_key" unique (org_id),
  constraint "organization_member_counters_pkey" primary key (id)
);

alter table "public"."organization_member_counters"
  enable row level security;

create table "public"."organization_members" (
  "id"         uuid                     not null default gen_random_uuid(),
  "org_id"     uuid                     not null,
  "profile_id" uuid                     not null,
  "role"       text                     not null default 'agent'::text,
  "status"     text                     not null default 'active'::text,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "display_id" text                     not null,
  "deleted_at" timestamp with time zone,
  constraint "organization_members_org_display_id_unique" unique (org_id, display_id),
  constraint "organization_members_pkey" primary key (id),
  constraint "organization_members_role_check" check ((role = ANY (ARRAY['owner'::text, 'manager'::text, 'agent'::text]))),
  constraint "organization_members_status_check" check ((status = ANY (ARRAY['invited'::text, 'active'::text, 'suspended'::text, 'removed'::text]))),
  constraint "organization_members_unique" unique (org_id, profile_id)
);

alter table "public"."organization_members"
  enable row level security;

create table "public"."organizations" (
  "id"           uuid                     not null default gen_random_uuid(),
  "name"         text                     not null,
  "created_at"   timestamp with time zone default now(),
  "industry"     text,
  "product_type" text,
  "company_size" text,
  "website"      text,
  "description"  text,
  "logo_url"     text,
  "country"      text,
  "timezone"     text,
  "updated_at"   timestamp with time zone default now(),
  "type"         text                     not null default 'personal'::text,
  "slug"         text,
  constraint "organizations_pkey" primary key (id),
  constraint "organizations_slug_key" unique (slug),
  constraint "organizations_type_check" check ((type = ANY (ARRAY['personal'::text, 'business'::text])))
);

alter table "public"."organizations"
  enable row level security;

create table "public"."profiles" (
  "id"                   uuid                     not null,
  "display_name"         text,
  "avatar_url"           text,
  "created_at"           timestamp with time zone not null default now(),
  "last_login"           timestamp with time zone,
  "first_name"           text,
  "last_name"            text,
  "job_title"            text,
  "deleted_at"           timestamp with time zone,
  "status"               text                     not null default 'pending'::text,
  "email"                text                     not null,
  "onboarding_completed" boolean                  not null default false,
  "onboarding_step"      smallint                 not null default 0,
  constraint "profiles_avatar_url_length" check (((avatar_url IS NULL) OR (char_length(avatar_url) <= 2048))),
  constraint "profiles_display_name_length" check ((char_length(display_name) <= 100)),
  constraint "profiles_email_key" unique (email),
  constraint "profiles_first_name_length" check ((char_length(first_name) <= 50)),
  constraint "profiles_last_name_length" check ((char_length(last_name) <= 50)),
  constraint "profiles_pkey" primary key (id),
  constraint "profiles_position_length" check (((job_title IS NULL) OR (char_length(job_title) <= 100))),
  constraint "profiles_status_check" check ((status = ANY (ARRAY['pending'::text, 'inactive'::text, 'active'::text, 'banned'::text, 'deleted'::text])))
);

alter table "public"."profiles"
  enable row level security;

create table "public"."refresh_tokens" (
  "id"             uuid                     not null default gen_random_uuid(),
  "profile_id"     uuid                     not null,
  "token_hash"     text                     not null,
  "expires_at"     timestamp with time zone not null,
  "created_at"     timestamp with time zone not null default now(),
  "revoked_at"     timestamp with time zone,
  "replaced_by_id" uuid,
  "ip_address"     inet,
  "user_agent"     text,
  "last_seen_at"   timestamp with time zone default now(),
  "org_id"         uuid,
  constraint "refresh_tokens_pkey" primary key (id),
  constraint "refresh_tokens_token_hash_key" unique (token_hash)
);

alter table "public"."refresh_tokens"
  enable row level security;

create table "public"."sms" (
  "id"         uuid                     not null default gen_random_uuid(),
  "org_id"     uuid                     not null,
  "lead_id"    uuid,
  "contact_id" uuid,
  "sender_id"  uuid                     not null,
  "content"    text                     not null,
  "status"     text                     not null default 'sent'::text,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "deleted_at" timestamp with time zone,
  constraint "sms_content_length_check" check ((char_length(content) <= 5000)),
  constraint "sms_pkey" primary key (id),
  constraint "sms_single_recipient" check ((((lead_id IS NOT NULL) AND (contact_id IS NULL)) OR ((lead_id IS NULL) AND (contact_id IS NOT NULL)))),
  constraint "sms_status_check" check ((status = ANY (ARRAY['queued'::text, 'sending'::text, 'sent'::text, 'delivered'::text, 'failed'::text])))
);

alter table "public"."sms"
  enable row level security;

create table "public"."subscriptions" (
  "id"                   uuid                     not null default gen_random_uuid(),
  "org_id"               uuid                     not null,
  "plan"                 text                     not null default 'Free'::text,
  "status"               text                     not null default 'active'::text,
  "current_period_start" timestamp with time zone,
  "current_period_end"   timestamp with time zone,
  "cancel_at_period_end" boolean                  default false,
  "created_at"           timestamp with time zone default now(),
  "updated_at"           timestamp with time zone default now(),
  "payment_provider"     text                     not null default 'none'::text,
  "provider_reference"   text,
  "billing_cycle"        text                     not null default 'monthly'::text,
  constraint "subscriptions_billing_cycle_check" check ((billing_cycle = ANY (ARRAY['monthly'::text, 'yearly'::text, 'none'::text]))),
  constraint "subscriptions_organization_unique" unique (org_id),
  constraint "subscriptions_payment_provider_check" check ((payment_provider = ANY (ARRAY['stripe'::text, 'paypal'::text, 'gcash'::text, 'maya'::text, 'none'::text]))),
  constraint "subscriptions_pkey" primary key (id),
  constraint "subscriptions_plan_check" check ((plan = ANY (ARRAY['Free'::text, 'Starter'::text, 'Team'::text, 'Business'::text, 'Enterprise'::text]))),
  constraint "subscriptions_status_check" check ((status = ANY (ARRAY['active'::text, 'cancelled'::text, 'expired'::text, 'past_due'::text])))
);

alter table "public"."subscriptions"
  enable row level security;

create table "public"."super_admin_audit_log" (
  "id"             uuid                     not null default gen_random_uuid(),
  "event_type"     text                     not null,
  "super_admin_id" uuid,
  "target_user_id" uuid,
  "target_org_id"  uuid,
  "ip_address"     text,
  "details"        jsonb                    default '{}'::jsonb,
  "created_at"     timestamp with time zone default now(),
  constraint "super_admin_audit_log_pkey" primary key (id)
);

alter table "public"."super_admin_audit_log"
  enable row level security;

create table "public"."super_admin_sessions" (
  "id"             uuid                     not null default gen_random_uuid(),
  "super_admin_id" uuid                     not null,
  "session_token"  text                     not null,
  "ip_address"     text,
  "user_agent"     text,
  "created_at"     timestamp with time zone default now(),
  "last_activity"  timestamp with time zone default now(),
  "expires_at"     timestamp with time zone default (now() + '30 days'::interval),
  constraint "super_admin_sessions_pkey" primary key (id),
  constraint "super_admin_sessions_session_token_key" unique (session_token)
);

alter table "public"."super_admin_sessions"
  enable row level security;

create table "public"."tasks" (
  "id"           uuid                     not null default gen_random_uuid(),
  "org_id"       uuid                     not null,
  "author_id"    uuid                     not null,
  "assigned_to"  uuid,
  "target_type"  character varying(20)    not null,
  "target_id"    uuid,
  "title"        text                     not null,
  "description"  text                     not null default ''::text,
  "status"       character varying(20)    not null default 'todo'::character varying,
  "priority"     character varying(20)    not null default 'medium'::character varying,
  "visibility"   character varying(20)    not null default 'private'::character varying,
  "due_date"     timestamp with time zone,
  "reminder_at"  timestamp with time zone,
  "completed_at" timestamp with time zone,
  "created_at"   timestamp with time zone not null default now(),
  "updated_at"   timestamp with time zone not null default now(),
  "updated_by"   uuid,
  "deleted_at"   timestamp with time zone,
  "deleted_by"   uuid,
  constraint "tasks_description_length_check" check ((char_length(description) <= 2000)),
  constraint "tasks_pkey" primary key (id),
  constraint "tasks_priority_check"
    check (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
  constraint "tasks_status_check"
    check (((status)::text = ANY ((ARRAY['todo'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
  constraint "tasks_target_type_check"
    check
    (((target_type)::text = ANY ((ARRAY['lead'::character varying, 'contact'::character varying, 'deal'::character varying, 'customer'::character varying, 'personal'::character
    varying])::text[]))),
  constraint "tasks_visibility_check" check (((visibility)::text = ANY ((ARRAY['public'::character varying, 'private'::character varying])::text[])))
);

alter table "public"."tasks"
  enable row level security;

create type "public"."email_provider" as enum (
  'resend'
);

create type "public"."email_status" as enum (
  'draft',
  'queued',
  'sent',
  'failed'
);

alter table "public"."emails"
  add column "status" public.email_status not null;

create type "public"."status" as enum (
  'draft',
  'queued',
  'sent',
  'failed'
);

create type "public"."task_type" as enum (
  'call',
  'email',
  'sms',
  'meeting',
  'other'
);

alter table "public"."tasks"
  add column "task_type" public.task_type not null default 'other'::public.task_type;

create or replace function public.auto_update_updated_at()
  returns trigger
  language plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function public.cleanup_old_activities()
  returns void
  language plpgsql
  security definer
  AS $function$
declare
    org record;
    retention_months integer;
    cutoff_date timestamptz;
begin

    for org in
        select
            o.id,
            s.plan
        from organizations o
        join subscriptions s
        on s.organization_id = o.id
    loop

        case org.plan

            when 'Free' then
                retention_months := 3;

            when 'Starter' then
                retention_months := 12;

            when 'Team' then
                retention_months := 36;

            when 'Business' then
                retention_months := 60;

            when 'Enterprise' then
                retention_months := null;

        end case;


        if retention_months is not null then

            cutoff_date :=
                date_trunc(
                    'month',
                    now() - (retention_months || ' months')::interval
                );


            delete from activities
            where org_id = org.id
            and created_at < cutoff_date;


        end if;

    end loop;

end;
$function$;

create or replace function public.conversation_belongs_to_current_org (
  target_conversation_id uuid
)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = target_conversation_id
      AND c.org_id = (auth.jwt() ->> 'org_id')::uuid
  );
$function$;

create or replace function public.create_super_admin_session (
  p_admin_id uuid,
  p_token    text,
  p_ip       text,
  p_ua       text
)
  returns SETOF public.super_admin_sessions
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  return query
  insert into public.super_admin_sessions (
    super_admin_id,
    session_token,
    ip_address,
    user_agent
  )
  values (
    p_admin_id,
    p_token,
    p_ip,
    p_ua
  )
  returning *;
end;
$function$;

create or replace function public.delete_super_admin_session (
  p_token text
)
  returns void
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  delete from public.super_admin_sessions
  where session_token = p_token;
end;
$function$;

create or replace function public.generate_member_code (
  p_org_id uuid,
  p_role   text
)
  returns text
  language plpgsql
  AS $function$
DECLARE
    next_number INTEGER;
    prefix TEXT;
BEGIN

    INSERT INTO public.organization_member_counters(org_id)
    VALUES (p_org_id)
    ON CONFLICT (org_id)
    DO NOTHING;


    IF p_role = 'owner' THEN

        UPDATE public.organization_member_counters
        SET owner_count = owner_count + 1
        WHERE org_id = p_org_id
        RETURNING owner_count INTO next_number;

        prefix := 'O';


    ELSIF p_role = 'manager' THEN

        UPDATE public.organization_member_counters
        SET manager_count = manager_count + 1
        WHERE org_id = p_org_id
        RETURNING manager_count INTO next_number;

        prefix := 'M';


    ELSIF p_role = 'agent' THEN

        UPDATE public.organization_member_counters
        SET agent_count = agent_count + 1
        WHERE org_id = p_org_id
        RETURNING agent_count INTO next_number;

        prefix := 'A';


    ELSE
        RAISE EXCEPTION 'Invalid role';
    END IF;


    RETURN prefix || '-' ||
        LPAD(next_number::TEXT, 5, '0');

END;
$function$;

create or replace function public.generate_org_display_id()
  returns text
  language plpgsql
  AS $function$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    result := result ||
      substr(
        chars,
        floor(random() * length(chars) + 1)::int,
        1
      );
  END LOOP;

  RETURN 'ORG-' || result;
END;
$function$;

create or replace function public.generate_profile_display_id()
  returns text
  language plpgsql
  AS $function$
BEGIN
  RETURN 'USR-' ||
    LPAD(
      nextval('profile_display_id_seq')::TEXT,
      5,
      '0'
    );
END;
$function$;

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  AS $function$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  )
  on conflict (id) do update
    set
      email = excluded.email,
      name  = coalesce(excluded.name, profiles.name);
  return new;
end;
$function$;

create or replace function public.has_org_role (
  target_org_id uuid,
  allowed_roles text[]
)
  returns boolean
  language sql
  security definer
  set search_path to 'public'
  AS $function$SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE org_id = target_org_id
      AND profile_id = auth.uid()
      AND role = ANY(allowed_roles)
  );$function$;

create or replace function public.is_active_current_org_member()
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.id = (auth.jwt() ->> 'member_id')::uuid
      AND om.org_id = (auth.jwt() ->> 'org_id')::uuid
      AND om.status = 'active'
  );
$function$;

create or replace function public.is_conversation_member (
  p_conversation_id uuid,
  p_profile_id      uuid
)
  returns boolean
  language sql
  security definer
  set search_path to 'public'
  AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversation_members
        WHERE conversation_id = p_conversation_id
          AND member_id = p_profile_id
    );
$function$;

create or replace function public.is_current_org_member (
  target_member_id uuid
)
  returns boolean
  language sql
  security definer
  set search_path to 'public'
  AS $function$SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.id = target_member_id
      AND om.profile_id = auth.uid()
      AND om.org_id = (auth.jwt() ->> 'org_id')::uuid
  );$function$;

create or replace function public.is_org_member (
  target_org_id uuid
)
  returns boolean
  language sql
  security definer
  set search_path to 'public'
  AS $function$SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE org_id = target_org_id
      AND profile_id = auth.uid()
  );$function$;

create or replace function public.log_super_admin_event (
  p_event_type     text,
  p_super_admin_id uuid,
  p_ip_address     text,
  p_details        jsonb
)
  returns void
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  insert into super_admin_audit_log (
    event_type,
    super_admin_id,
    ip_address,
    details
  )
  values (
    p_event_type,
    p_super_admin_id,
    p_ip_address,
    p_details
  );
end;
$function$;

create or replace function public.member_belongs_to_current_org (
  target_member_id uuid
)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.id = target_member_id
      AND om.org_id = (auth.jwt() ->> 'org_id')::uuid
  );$function$;

create or replace function public.set_member_display_id()
  returns trigger
  language plpgsql
  AS $function$
begin

  new.display_id := generate_member_code(
      new.org_id,
      new.role
  );

  return new;

end;
$function$;

create or replace function public.update_admin_last_login (
  p_admin_id uuid
)
  returns void
  language plpgsql
  security definer
  AS $function$
BEGIN
  UPDATE public.profiles SET last_login = now() WHERE id = p_admin_id;
END; $function$;

create or replace function public.update_conversation_last_message()
  returns trigger
  language plpgsql
  security definer
  AS $function$
begin
  update public.conversations
  set
    last_message_id = new.id,
    updated_at = now()
  where id = new.conversation_id;

  return new;
end;
$function$;

create or replace function public.update_super_admin_activity (
  p_token text
)
  returns void
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  update public.super_admin_sessions
  set last_activity = now()
  where session_token = p_token;
end;
$function$;

create or replace function public.update_super_admin_last_login (
  p_admin_id uuid
)
  returns void
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  update public.profiles
  set last_login = now()
  where id = p_admin_id;
end;
$function$;

create or replace function public.update_updated_at()
  returns trigger
  language plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function public.verify_super_admin_session (
  p_token text
)
  returns SETOF public.super_admin_sessions
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  return query
  select *
  from public.super_admin_sessions
  where session_token = p_token
    and expires_at > now();
end;
$function$;

alter table "public"."activities"
  add constraint "activities_contact_id_fkey" foreign key (contact_id) references public.contacts(id) on delete set null;

alter table "public"."calls"
  add constraint "calls_contact_id_fkey" foreign key (contact_id) references public.contacts(id) on delete cascade;

alter table "public"."conversation_members"
  add constraint "conversation_members_conversation_id_fkey" foreign key (conversation_id) references public.conversations(id) on delete cascade;

alter table "public"."activities"
  add constraint "activities_customer_id_fkey" foreign key (customer_id) references public.customers(id) on delete set null;

alter table "public"."customers"
  add constraint "fk_customer_contact" foreign key (contact_id) references public.contacts(id) on delete restrict;

alter table "public"."deals"
  add constraint "deals_contact_id_fkey" foreign key (contact_id) references public.contacts(id);

alter table "public"."emails"
  add constraint "fk_email_contact" foreign key (contact_id) references public.contacts(id) on delete set null;

alter table "public"."emails"
  add constraint "fk_email_customer" foreign key (customer_id) references public.customers(id) on delete set null;

alter table "public"."activities"
  add constraint "activities_lead_id_fkey" foreign key (lead_id) references public.leads(id) on delete set null;

alter table "public"."calls"
  add constraint "calls_lead_id_fkey" foreign key (lead_id) references public.leads(id) on delete cascade;

alter table "public"."contacts"
  add constraint "contacts_lead_id_fkey" foreign key (lead_id) references public.leads(id);

alter table "public"."emails"
  add constraint "fk_email_lead" foreign key (lead_id) references public.leads(id) on delete set null;

alter table "public"."messages"
  add constraint "messages_conversation_id_fkey" foreign key (conversation_id) references public.conversations(id) on delete cascade;

alter table "public"."conversations"
  add constraint "conversations_last_message_id_fkey" foreign key (last_message_id) references public.messages(id);

alter table "public"."organization_invite_acceptances"
  add constraint "organization_invite_acceptances_invite_id_fkey" foreign key (invite_id) references public.organization_invites(id) on delete cascade;

alter table "public"."activities"
  add constraint "activities_created_by_fkey" foreign key (created_by) references public.organization_members(id);

alter table "public"."calls"
  add constraint "calls_assigned_to_fkey" foreign key (assigned_to) references public.organization_members(id);

alter table "public"."calls"
  add constraint "calls_created_by_fkey" foreign key (created_by) references public.organization_members(id);

alter table "public"."contacts"
  add constraint "contacts_deleted_by_fkey" foreign key (deleted_by) references public.organization_members(id);

alter table "public"."contacts"
  add constraint "contacts_owner_id_fkey" foreign key (owner_id) references public.organization_members(id);

alter table "public"."contacts"
  add constraint "contacts_updated_by_fkey" foreign key (updated_by) references public.organization_members(id);

alter table "public"."conversation_members"
  add constraint "conversation_members_member_id_fkey" foreign key (member_id) references public.organization_members(id);

alter table "public"."conversations"
  add constraint "conversations_created_by_fkey" foreign key (created_by) references public.organization_members(id);

alter table "public"."customers"
  add constraint "customers_deleted_by_fkey" foreign key (deleted_by) references public.organization_members(id);

alter table "public"."customers"
  add constraint "customers_owner_id_fkey" foreign key (owner_id) references public.organization_members(id);

alter table "public"."customers"
  add constraint "customers_updated_by_fkey" foreign key (updated_by) references public.organization_members(id);

alter table "public"."deals"
  add constraint "deals_closed_by_fkey" foreign key (closed_by) references public.organization_members(id);

alter table "public"."deals"
  add constraint "deals_deleted_by_fkey" foreign key (deleted_by) references public.organization_members(id);

alter table "public"."deals"
  add constraint "deals_owner_id_fkey" foreign key (owner_id) references public.organization_members(id);

alter table "public"."deals"
  add constraint "deals_updated_by_fkey" foreign key (updated_by) references public.organization_members(id);

alter table "public"."emails"
  add constraint "emails_sender_id_fkey" foreign key (sender_id) references public.organization_members(id);

alter table "public"."leads"
  add constraint "leads_deleted_by_fkey" foreign key (deleted_by) references public.organization_members(id);

alter table "public"."leads"
  add constraint "leads_owner_id_fkey" foreign key (owner_id) references public.organization_members(id);

alter table "public"."leads"
  add constraint "leads_updated_by_fkey" foreign key (updated_by) references public.organization_members(id);

alter table "public"."messages"
  add constraint "messages_sender_id_fkey" foreign key (sender_id) references public.organization_members(id);

alter table "public"."notes"
  add constraint "notes_author_id_fkey" foreign key (author_id) references public.organization_members(id);

alter table "public"."notes"
  add constraint "notes_deleted_by_fkey" foreign key (deleted_by) references public.organization_members(id);

alter table "public"."notes"
  add constraint "notes_updated_by_fkey" foreign key (updated_by) references public.organization_members(id);

alter table "public"."activities"
  add constraint "activities_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."calls"
  add constraint "calls_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."contacts"
  add constraint "contacts_org_id_fkey" foreign key (org_id) references public.organizations(id);

alter table "public"."conversations"
  add constraint "conversations_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."customers"
  add constraint "fk_customer_org" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."deals"
  add constraint "deals_org_id_fkey" foreign key (org_id) references public.organizations(id);

alter table "public"."emails"
  add constraint "fk_email_org" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."leads"
  add constraint "leads_org_id_fkey" foreign key (org_id) references public.organizations(id);

alter table "public"."notes"
  add constraint "notes_org_id_fkey" foreign key (org_id) references public.organizations(id);

alter table "public"."organization_invites"
  add constraint "organization_invites_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."organization_member_counters"
  add constraint "organization_member_counters_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."organization_members"
  add constraint "organization_members_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."profiles"
  add constraint "profiles_id_fkey" foreign key (id) references auth.users(id) on delete cascade;

alter table "public"."organization_invite_acceptances"
  add constraint "organization_invite_acceptances_profile_id_fkey" foreign key (profile_id) references public.profiles(id) on delete cascade;

alter table "public"."organization_invites"
  add constraint "organization_invites_created_by_fkey" foreign key (created_by) references public.profiles(id) on delete cascade;

alter table "public"."organization_members"
  add constraint "organization_members_profile_fkey" foreign key (profile_id) references public.profiles(id) on delete cascade;

alter table "public"."refresh_tokens"
  add constraint "refresh_tokens_org_id_fkey" foreign key (org_id) references public.organizations(id);

alter table "public"."refresh_tokens"
  add constraint "refresh_tokens_profile_id_fkey" foreign key (profile_id) references public.profiles(id) on delete cascade;

alter table "public"."refresh_tokens"
  add constraint "refresh_tokens_replaced_by_id_fkey" foreign key (replaced_by_id) references public.refresh_tokens(id);

alter table "public"."sms"
  add constraint "sms_contact_id_fkey" foreign key (contact_id) references public.contacts(id) on delete set null;

alter table "public"."sms"
  add constraint "sms_lead_id_fkey" foreign key (lead_id) references public.leads(id) on delete set null;

alter table "public"."sms"
  add constraint "sms_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."sms"
  add constraint "sms_sender_id_fkey" foreign key (sender_id) references public.organization_members(id);

alter table "public"."subscriptions"
  add constraint "subscriptions_org_id_fkey" foreign key (org_id) references public.organizations(id) on delete cascade;

alter table "public"."super_admin_audit_log"
  add constraint "super_admin_audit_log_super_admin_id_fkey" foreign key (super_admin_id) references public.profiles(id) on delete set null;

alter table "public"."super_admin_audit_log"
  add constraint "super_admin_audit_log_target_org_id_fkey" foreign key (target_org_id) references public.organizations(id) on delete set null;

alter table "public"."super_admin_audit_log"
  add constraint "super_admin_audit_log_target_user_id_fkey" foreign key (target_user_id) references public.profiles(id) on delete set null;

alter table "public"."super_admin_sessions"
  add constraint "super_admin_sessions_super_admin_id_fkey" foreign key (super_admin_id) references public.profiles(id) on delete cascade;

alter table "public"."tasks"
  add constraint "tasks_assigned_to_fkey" foreign key (assigned_to) references public.organization_members(id);

alter table "public"."tasks"
  add constraint "tasks_author_id_fkey" foreign key (author_id) references public.organization_members(id);

alter table "public"."tasks"
  add constraint "tasks_deleted_by_fkey" foreign key (deleted_by) references public.organization_members(id);

alter table "public"."tasks"
  add constraint "tasks_org_id_fkey" foreign key (org_id) references public.organizations(id);

alter table "public"."tasks"
  add constraint "tasks_updated_by_fkey" foreign key (updated_by) references public.organization_members(id);

create index contacts_org_id_idx on public.contacts using btree (org_id);

create index contacts_owner_id_idx on public.contacts using btree (owner_id);

create index idx_activities_contact on public.activities using btree (contact_id);

create index idx_activities_created_at on public.activities using btree (created_at desc);

create index idx_activities_creator on public.activities using btree (created_by);

create index idx_activities_customer on public.activities using btree (customer_id);

create index idx_activities_lead on public.activities using btree (lead_id);

create index idx_activities_org_created on public.activities using btree (org_id, created_at desc);

create index idx_activities_org on public.activities using btree (org_id);

create index idx_calls_assigned_to on public.calls using btree (assigned_to);

create index idx_calls_contact_id on public.calls using btree (contact_id);

create index idx_calls_created_at on public.calls using btree (created_at desc);

create index idx_calls_lead_id on public.calls using btree (lead_id);

create index idx_calls_org_id on public.calls using btree (org_id);

create index idx_calls_scheduled_for on public.calls using btree (scheduled_for);

create index idx_calls_status on public.calls using btree (status);

create index idx_conversation_members_conversation on public.conversation_members using btree (conversation_id);

create index idx_conversation_members_profile_conversation on public.conversation_members using btree (member_id, conversation_id);

create index idx_conversation_members_profile on public.conversation_members using btree (member_id);

create index idx_conversations_org on public.conversations using btree (org_id)
  where (deleted_at is null);

create index idx_customers_contact_id on public.customers using btree (contact_id);

create index idx_customers_org_id on public.customers using btree (org_id);

create index idx_customers_owner_id on public.customers using btree (owner_id);

create index idx_customers_status on public.customers using btree (status);

create index idx_deals_contact_id on public.deals using btree (contact_id);

create index idx_deals_org_id on public.deals using btree (org_id);

create index idx_deals_owner_id on public.deals using btree (owner_id);

create index idx_deals_stage on public.deals using btree (stage);

create index idx_emails_contact_history on public.emails using btree (contact_id, created_at desc);

create index idx_emails_contact on public.emails using btree (contact_id);

create index idx_emails_created_at on public.emails using btree (created_at desc);

create index idx_emails_customer_history on public.emails using btree (customer_id, created_at desc);

create index idx_emails_customer on public.emails using btree (customer_id);

create index idx_emails_lead_history on public.emails using btree (lead_id, created_at desc);

create index idx_emails_lead on public.emails using btree (lead_id);

create index idx_emails_org on public.emails using btree (org_id);

create index idx_emails_preview_text on public.emails using btree (preview_text);

create index idx_emails_recipient_email on public.emails using btree (recipient_email);

create index idx_emails_sender_email on public.emails using btree (sender_email);

create index idx_emails_sender on public.emails using btree (sender_id);

create index idx_emails_sent_at on public.emails using btree (sent_at desc);

create index idx_emails_status on public.emails using btree (status);

create index idx_emails_subject on public.emails using btree (subject);

create index idx_feedback_created_at on public.feedbacks using btree (created_at desc);

create index idx_messages_conversation_created on public.messages using btree (conversation_id, created_at)
  where (deleted_at is null);

create index idx_messages_entity on public.messages using btree (entity_type, entity_id);

create index idx_messages_sender on public.messages using btree (sender_id);

create unique index idx_org_invites_code on public.organization_invites using btree (code);

create index idx_org_invites_email on public.organization_invites using btree (email);

create index idx_org_invites_expires on public.organization_invites using btree (expires_at);

create index idx_org_invites_lookup on public.organization_invites using btree (code, status);

create index idx_org_invites_organization on public.organization_invites using btree (org_id);

create index idx_org_invites_status on public.organization_invites using btree (status);

create index idx_organization_members_display_id on public.organization_members using btree (display_id);

create index idx_refresh_tokens_active on public.refresh_tokens using btree (profile_id)
  where (revoked_at is null);

create index idx_refresh_tokens_profile_id on public.refresh_tokens using btree (profile_id);

create index idx_refresh_tokens_token_hash on public.refresh_tokens using btree (token_hash);

create index idx_sms_contact_id on public.sms using btree (contact_id);

create index idx_sms_created_at on public.sms using btree (created_at desc);

create index idx_sms_lead_id on public.sms using btree (lead_id);

create index idx_sms_org_deleted_at on public.sms using btree (org_id, deleted_at);

create index idx_sms_org_id on public.sms using btree (org_id);

create index idx_sms_sender_id on public.sms using btree (sender_id);

create index idx_sms_status on public.sms using btree (status);

create index idx_super_admin_audit_log_created_at on public.super_admin_audit_log using btree (created_at desc);

create index idx_super_admin_audit_log_event_type on public.super_admin_audit_log using btree (event_type);

create index idx_super_admin_audit_log_super_admin_id on public.super_admin_audit_log using btree (super_admin_id);

create index leads_org_id_idx on public.leads using btree (org_id);

create index leads_owner_id_idx on public.leads using btree (owner_id);

create index notes_author_idx on public.notes using btree (author_id);

create index notes_org_idx on public.notes using btree (org_id);

create index notes_target_idx on public.notes using btree (target_type, target_id);

create index tasks_assigned_to_idx on public.tasks using btree (assigned_to);

create index tasks_author_idx on public.tasks using btree (author_id);

create index tasks_due_date_idx on public.tasks using btree (due_date);

create index tasks_org_idx on public.tasks using btree (org_id);

create index tasks_priority_idx on public.tasks using btree (priority);

create index tasks_status_idx on public.tasks using btree (status);

create index tasks_target_idx on public.tasks using btree (target_type, target_id);

create unique index uniq_org_announcement on public.conversations using btree (org_id)
  where ((type = 'announcement'::text) AND (deleted_at is null));

create unique index uniq_org_general on public.conversations using btree (org_id)
  where ((type = 'organization'::text) AND (deleted_at is null));

create trigger set_updated_at
  before update on public.activities
  for each row
  execute function public.auto_update_updated_at();

create trigger set_updated_at
  before update on public.calls
  for each row
  execute function public.auto_update_updated_at();

create trigger set_updated_at
  before update on public.contacts
  for each row
  execute function public.auto_update_updated_at();

create trigger conversations_updated_at
  before update on public.conversations
  for each row
  execute function public.auto_update_updated_at();

create trigger set_updated_at
  before update on public.customers
  for each row
  execute function public.auto_update_updated_at();

create trigger set_updated_at
  before update on public.deals
  for each row
  execute function public.auto_update_updated_at();

create trigger set_updated_at
  before update on public.emails
  for each row
  execute function public.auto_update_updated_at();

create trigger set_updated_at
  before update on public.leads
  for each row
  execute function public.auto_update_updated_at();

create trigger messages_updated_at
  before update on public.messages
  for each row
  execute function public.auto_update_updated_at();

create trigger trg_update_conversation_last_message
  after insert on public.messages
  for each row
  execute function public.update_conversation_last_message();

create trigger set_notes_updated_at
  before update on public.notes
  for each row
  execute function public.auto_update_updated_at();

create trigger organization_members_display_id_trigger
  before insert on public.organization_members
  for each row
  execute function public.set_member_display_id();

create trigger trg_organizations_updated_at
  before update on public.organizations
  for each row
  execute function public.update_updated_at();

create trigger set_sms_updated_at
  before update on public.sms
  for each row
  execute function public.auto_update_updated_at();

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.auto_update_updated_at();

create policy "Admins can delete organization activities" on "public"."activities"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can create organization activities" on "public"."activities"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (created_by = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update organization activities" on "public"."activities"
  for update
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (created_by = ((auth.jwt() ->> 'member_id'::text))::uuid)))
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (created_by = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can view organization activities" on "public"."activities"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Admins can delete organization calls" on "public"."calls"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can create organization calls" on "public"."calls"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (created_by = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update accessible calls" on "public"."calls"
  for all
  to "authenticated"
  using
    (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND ((created_by = ((auth.jwt() ->> 'member_id'::text))::uuid) or (assigned_to = ((auth.jwt() ->>
    'member_id'::text))::uuid))))
  with
    check
    (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND ((created_by = ((auth.jwt() ->> 'member_id'::text))::uuid) OR (assigned_to = ((auth.jwt() ->>
    'member_id'::text))::uuid))));

create policy "Members can view organization calls" on "public"."calls"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can create organization contacts" on "public"."contacts"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (owner_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update organization contacts" on "public"."contacts"
  for update
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid))
  with check ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view organization contacts" on "public"."contacts"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Owners and Managers can delete organization contacts" on "public"."contacts"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can add conversation members" on "public"."conversation_members"
  for insert
  to "authenticated"
  with check ((public.is_active_current_org_member() AND public.conversation_belongs_to_current_org(conversation_id) AND public.member_belongs_to_current_org(member_id)));

create policy "Members can update their conversation memberships" on "public"."conversation_members"
  for update
  to "authenticated"
  using ((member_id = ((auth.jwt() ->> 'member_id'::text))::uuid))
  with check ((member_id = ((auth.jwt() ->> 'member_id'::text))::uuid));

create policy "Members can view all members of their conversations" on "public"."conversation_members"
  for select
  to "authenticated"
  using (public.is_conversation_member(conversation_id, ((auth.jwt() ->> 'member_id'::text))::uuid));

create policy "Members can view conversation members" on "public"."conversation_members"
  for delete
  to "authenticated"
  using (public.is_conversation_member(conversation_id, ((auth.jwt() ->> 'member_id'::text))::uuid));

create policy "Members can view their conversation memberships" on "public"."conversation_members"
  for select
  to "authenticated"
  using ((member_id = ( select organization_members.id
   from public.organization_members
  where (organization_members.profile_id = auth.uid()))));

create policy "Admins can delete conversations" on "public"."conversations"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text)));

create policy "Creators can update conversations" on "public"."conversations"
  for update
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (created_by = auth.uid())))
  with check ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can create conversations" on "public"."conversations"
  for insert
  to "authenticated"
  with
    check
    (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (created_by = ((auth.jwt() ->> 'member_id'::text))::uuid) AND ((type = 'direct'::text) OR ((type = ANY
    (ARRAY['organization'::text, 'announcement'::text])) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'owner'::text)))));

create policy "Members can view their conversations" on "public"."conversations"
  for select
  to "authenticated"
  using (public.is_conversation_member(id, ((auth.jwt() ->> 'member_id'::text))::uuid));

create policy "Members can create organization customers" on "public"."customers"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (owner_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update organization customers" on "public"."customers"
  for update
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid))
  with check ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view organization customers" on "public"."customers"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Owners and Managers can delete organization customers" on "public"."customers"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can create organization deals" on "public"."deals"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (owner_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update organization deals" on "public"."deals"
  for update
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid))
  with check ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view organization deals" on "public"."deals"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Owners and Managers can delete organization deals" on "public"."deals"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can create organization emails" on "public"."emails"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (sender_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update organization emails" on "public"."emails"
  for all
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid))
  with check ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view organization emails" on "public"."emails"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Owners and Managers can delete organization emails" on "public"."emails"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can create organization leads" on "public"."leads"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (owner_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update organization leads" on "public"."leads"
  for update
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid))
  with check ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view organization leads" on "public"."leads"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Owners and Managers can delete organization leads" on "public"."leads"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can send messages" on "public"."messages"
  for insert
  to "authenticated"
  with check (((sender_id = ((auth.jwt() ->> 'member_id'::text))::uuid) AND public.is_conversation_member(conversation_id, ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can view conversation messages" on "public"."messages"
  for select
  to "authenticated"
  using (public.is_conversation_member(conversation_id, ((auth.jwt() ->> 'member_id'::text))::uuid));

create policy "Users can delete own messages" on "public"."messages"
  for delete
  to "authenticated"
  using ((sender_id = ((auth.jwt() ->> 'member_id'::text))::uuid));

create policy "Users can update own messages" on "public"."messages"
  for update
  to "authenticated"
  using ((sender_id = ((auth.jwt() ->> 'member_id'::text))::uuid))
  with check ((sender_id = ((auth.jwt() ->> 'member_id'::text))::uuid));

create policy "Members can create notes" on "public"."notes"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (author_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can view accessible notes" on "public"."notes"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Users can delete own notes" on "public"."notes"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (author_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Users can update own notes" on "public"."notes"
  for update
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (author_id = ((auth.jwt() ->> 'member_id'::text))::uuid)))
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (author_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Organization members can view invite acceptances" on "public"."organization_invite_acceptances"
  for select
  to "authenticated"
  using ((exists ( select 1
   from (public.organization_invites i
     JOIN public.organization_members om on ((om.org_id = i.org_id)))
  where ((i.id = organization_invite_acceptances.invite_id) AND (om.profile_id = auth.uid())))));

create policy "Users can record their own invite acceptance" on "public"."organization_invite_acceptances"
  for insert
  to "authenticated"
  with check ((profile_id = auth.uid()));

create policy "Members can view organization invites" on "public"."organization_invites"
  for select
  to "authenticated"
  using ((org_id in ( select organization_invites.org_id
   from public.organization_members
  where ((organization_members.profile_id = auth.uid()) AND (organization_members.status = 'active'::text)))));

create policy "Owners and managers can create invites" on "public"."organization_invites"
  for insert
  to "authenticated"
  with check ((org_id IN ( SELECT organization_invites.org_id
   FROM public.organization_members
  WHERE
    ((organization_members.profile_id = auth.uid()) AND (organization_members.status = 'active'::text) AND (organization_members.role = ANY (ARRAY['owner'::text,
    'manager'::text]))))));

create policy "Owners and managers can delete invites" on "public"."organization_invites"
  for delete
  to "authenticated"
  using ((org_id in ( select organization_invites.org_id
   from public.organization_members
  where
    ((organization_members.profile_id = auth.uid()) AND (organization_members.status = 'active'::text) AND (organization_members.role = ANY (ARRAY['owner'::text,
    'manager'::text]))))));

create policy "Owners and managers can update invites" on "public"."organization_invites"
  for update
  to "authenticated"
  using ((org_id in ( select organization_invites.org_id
   from public.organization_members
  where
    ((organization_members.profile_id = auth.uid()) AND (organization_members.status = 'active'::text) AND (organization_members.role = ANY (ARRAY['owner'::text,
    'manager'::text]))))))
  with check ((org_id IN ( SELECT organization_invites.org_id
   FROM public.organization_members
  WHERE
    ((organization_members.profile_id = auth.uid()) AND (organization_members.status = 'active'::text) AND (organization_members.role = ANY (ARRAY['owner'::text,
    'manager'::text]))))));

create policy "Members can view organization members" on "public"."organization_members"
  for select
  to "authenticated"
  using (public.is_org_member(org_id));

create policy "Owners and managers can update members" on "public"."organization_members"
  for update
  to "authenticated"
  using (public.has_org_role(org_id, ARRAY['owner'::text, 'manager'::text]))
  with check (public.has_org_role(org_id, ARRAY['owner'::text, 'manager'::text]));

create policy "Owners can add organization members" on "public"."organization_members"
  for insert
  to "authenticated"
  with check (public.has_org_role(org_id, ARRAY['owner'::text]));

create policy "Owners can remove organization members" on "public"."organization_members"
  for delete
  to "authenticated"
  using (public.has_org_role(org_id, ARRAY['owner'::text]));

create policy "Members can update organization" on "public"."organizations"
  for update
  to "authenticated"
  using ((id = ((auth.jwt() ->> 'org_id'::text))::uuid))
  with check ((id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view organization" on "public"."organizations"
  for select
  to "authenticated"
  using ((id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "No deletes" on "public"."organizations"
  for delete
  to "authenticated"
  using (false);

create policy "Organization members can view profiles" on "public"."profiles"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.organization_members om
  where ((om.profile_id = profiles.id) AND (om.org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (om.deleted_at is null)))));

create policy "Users can create their own profile" on "public"."profiles"
  for insert
  to "authenticated"
  with check ((auth.uid() = id));

create policy "Users can update own profile" on "public"."profiles"
  for update
  to "authenticated"
  using ((id = auth.uid()))
  with check ((id = auth.uid()));

create policy "Users can view their own profile" on "public"."profiles"
  for select
  to "authenticated"
  using ((id = auth.uid()));

create policy "deny_all_refresh_tokens" on "public"."refresh_tokens"
  for all
  to PUBLIC
  using (false);

create policy "Admins can delete organization sms messages" on "public"."sms"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can create organization sms messages" on "public"."sms"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (sender_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can view organization sms messages" on "public"."sms"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view organization subscription" on "public"."subscriptions"
  for select
  to "authenticated"
  using ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Owners can create subscription" on "public"."subscriptions"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'owner'::text)));

create policy "Owners can delete subscription" on "public"."subscriptions"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'owner'::text)));

create policy "Owners can update subscription" on "public"."subscriptions"
  for update
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'owner'::text)))
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'owner'::text)));

create policy "Admins can delete organization tasks" on "public"."tasks"
  for delete
  to "authenticated"
  using (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = ANY (ARRAY['owner'::text, 'manager'::text]))));

create policy "Members can create organization tasks" on "public"."tasks"
  for insert
  to "authenticated"
  with check (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (author_id = ((auth.jwt() ->> 'member_id'::text))::uuid)));

create policy "Members can update accessible tasks" on "public"."tasks"
  for update
  to "authenticated"
  using
    (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND ((author_id = ((auth.jwt() ->> 'member_id'::text))::uuid) or (assigned_to = ((auth.jwt() ->>
    'member_id'::text))::uuid))))
  with check ((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid));

create policy "Members can view accessible organization tasks" on "public"."tasks"
  for select
  to "authenticated"
  using
    (((org_id = ((auth.jwt() ->> 'org_id'::text))::uuid) AND (((visibility)::text = 'public'::text) or (author_id = ((auth.jwt() ->> 'member_id'::text))::uuid) or (assigned_to =
    ((auth.jwt() ->> 'member_id'::text))::uuid))));

alter publication "supabase_realtime" add table "public"."conversation_members";

alter publication "supabase_realtime" add table "public"."conversations";

alter publication "supabase_realtime" add table "public"."messages";

comment on column "public"."conversations"."industry" is '`';

comment on extension "pg_cron" is 'Job scheduler for PostgreSQL';

grant execute on function "public"."auto_update_updated_at"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."cleanup_old_activities"() to public, "anon", "authenticated", "postgres", "service_role";

revoke all on function "public"."conversation_belongs_to_current_org"(uuid) from public;

grant execute on function "public"."conversation_belongs_to_current_org"(uuid) to "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."create_super_admin_session"(uuid, text, text, text) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."delete_super_admin_session"(text) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."generate_member_code"(uuid, text) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."generate_org_display_id"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."generate_profile_display_id"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."handle_new_user"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."has_org_role"(uuid, text[]) to public, "anon", "authenticated", "postgres", "service_role";

revoke all on function "public"."is_active_current_org_member"() from public;

grant execute on function "public"."is_active_current_org_member"() to "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."is_conversation_member"(uuid, uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."is_current_org_member"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."is_org_member"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."log_super_admin_event"(text, uuid, text, jsonb) to public, "anon", "authenticated", "postgres", "service_role";

revoke all on function "public"."member_belongs_to_current_org"(uuid) from public;

grant execute on function "public"."member_belongs_to_current_org"(uuid) to "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."set_member_display_id"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."update_admin_last_login"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."update_conversation_last_message"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."update_super_admin_activity"(text) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."update_super_admin_last_login"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."update_updated_at"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."verify_super_admin_session"(text) to public, "anon", "authenticated", "postgres", "service_role";

grant select, update, usage on sequence "public"."profile_display_id_seq" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."activities" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."calls" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."contacts" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."conversation_members" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."conversations" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."customers" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."deals" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."emails" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."feedbacks" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."leads" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."messages" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."notes" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."organization_invite_acceptances"
  to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."organization_invites" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."organization_member_counters"
  to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."organization_members" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."organizations" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."profiles" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."refresh_tokens" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."sms" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."subscriptions" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."super_admin_audit_log" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."super_admin_sessions" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."tasks" to "anon", "authenticated", "postgres", "service_role";

grant usage on type "public"."email_provider" to "postgres";

grant usage on type "public"."email_status" to "postgres";

grant usage on type "public"."status" to "postgres";

grant usage on type "public"."task_type" to "postgres";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "anon";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "authenticated";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "service_role";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "anon";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "authenticated";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "service_role";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "anon";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "authenticated";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "service_role";

select cron.schedule_in_database('cleanup-old-activities', '0 2 * * *', 'select cleanup_old_activities();', 'postgres', null, true);

select cron.schedule_in_database('cleanup-retention-data', '0 2 * * *', '
    select cleanup_old_activities();
    select cleanup_old_messages();
  ', 'postgres', null, true);

alter table "public"."organizations"
  add column "display_id" text not null default public.generate_org_display_id();

alter table "public"."organizations"
  add constraint "organizations_display_id_key" unique (display_id);

