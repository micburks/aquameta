// @flow
type IdeForeignKey = Array<{|
  to_column_id: ?ColumnId,
  table_id: ?RelationId,
  from_column_id: ?ColumnId,
|}>;
type MetaForeignTable = Array<{|
  options: ?any,
  schema_name: ?String,
  foreign_server_id: ?ForeignServerId,
  id: ?RelationId,
  name: ?String,
  schema_id: ?SchemaId,
|}>;
type BundleUntrackedRowByRelation = Array<{|
  relation_id: ?RelationId,
  count: ?Integer,
  relation_name: ?String,
  schema_id: ?SchemaId,
|}>;
type BundleStageFieldChanged = Array<{|
  id: String,
  bundle_id: String,
  field_id: ?FieldId,
  new_value: ?String,
|}>;
type EndpointMimetype = Array<{|
  id: String,
  mimetype: String,
|}>;
type MetaRoleInheritance = Array<{|
  member_role_id: ?RoleId,
  member_role_name: ?String,
  role_name: ?String,
  id: ?String,
  role_id: ?RoleId,
|}>;
type EndpointFunctionFieldMimetype = Array<{|
  id: String,
  mimetype_id: String,
  field_name: ?String,
  function_name: ?String,
  schema_name: ?String,
|}>;
type EventSubscriptionTable = Array<{|
  id: String,
  relation_id: ?RelationId,
  session_id: String,
  created_at: String,
|}>;
type MetaSequence = Array<{|
  increment: ?Integer,
  start_value: ?Integer,
  schema_name: ?String,
  maximum_value: ?Integer,
  minimum_value: ?Integer,
  cycle: ?Boolean,
  id: ?SequenceId,
  name: ?String,
  schema_id: ?SchemaId,
|}>;
type BundleTrackedRowAdded = Array<{|
  id: String,
  row_id: ?RowId,
  bundle_id: String,
|}>;
type EventSubscriptionColumn = Array<{|
  id: String,
  session_id: String,
  column_id: ?ColumnId,
  created_at: String,
|}>;
type EndpointRemoteEndpoint = Array<{|
  id: String,
  url: String,
  name: ?String,
|}>;
type BundleNotIgnoredRowStmt = Array<{|
  relation_id: ?RelationId,
  primary_key_column_id: ?ColumnId,
  schema_id: ?SchemaId,
  stmt: ?String,
|}>;
type BundleRowset = Array<{|
  id: String,
|}>;
type MetaExtension = Array<{|
  schema_name: ?String,
  id: ?ExtensionId,
  version: ?String,
  name: ?String,
  schema_id: ?SchemaId,
|}>;
type PresComponent = Array<{|
  id: String,
  name: String,
  js: ?String,
|}>;
type MetaRelation = Array<{|
  schema_name: ?String,
  id: ?RelationId,
  primary_key_column_ids: ?ColumnId,
  name: ?String,
  primary_key_column_names: ?String,
  type: ?String,
  schema_id: ?SchemaId,
|}>;
type WidgetComponent = Array<{|
  id: String,
  docs: ?String,
  name: String,
  js: ?String,
|}>;
type MetaColumn = Array<{|
  relation_id: ?RelationId,
  schema_name: ?String,
  type_name: ?String,
  primary_key: ?Boolean,
  relation_name: ?String,
  type_id: ?TypeId,
  id: ?ColumnId,
  nullable: ?Boolean,
  name: ?String,
  position: ?Integer,
  default: ?String,
|}>;
type SemanticsColumnPurpose = Array<{|
  id: String,
  purpose: String,
|}>;
type SemanticsColumn = Array<{|
  id: String,
  priority: Integer,
  column_id: ?ColumnId,
  purpose_id: String,
  widget_id: String,
|}>;
type IdeBundleContainedRelation = Array<{|
  schema_name: ?String,
  count: ?Integer,
  name: ?String,
|}>;
type SemanticsForeignKey = Array<{|
  id: String,
  inline: ?Boolean,
  foreign_key_id: ?ForeignKeyId,
|}>;
type EndpointResourceBinary = Array<{|
  id: String,
  active: ?Boolean,
  path: String,
  mimetype_id: String,
  content: String,
|}>;
type EventEvent = Array<{|
  id: String,
  created_at: String,
  session_id: String,
  event: ?any,
|}>;
type MetaFunctionParameter = Array<{|
  schema_name: ?String,
  type_name: ?String,
  type_id: ?TypeId,
  function_name: ?String,
  name: ?String,
  mode: ?String,
  function_id: ?FunctionId,
  position: ?Integer,
  schema_id: ?SchemaId,
  default: ?String,
|}>;
type WidgetWidgetView = Array<{|
  id: String,
  widget_id: String,
  view_id: ?RelationId,
|}>;
type MetaSchema = Array<{|
  id: ?SchemaId,
  name: ?String,
|}>;
type MetaForeignKey = Array<{|
  on_update: ?String,
  schema_name: ?String,
  table_id: ?RelationId,
  id: ?ForeignKeyId,
  name: ?String,
  from_column_ids: ?ColumnId,
  on_delete: ?String,
  table_name: ?String,
  to_column_ids: ?ColumnId,
|}>;
type BundleOffstageRowDeleted = Array<{|
  bundle_id: ?String,
  row_id: ?RowId,
|}>;
type MetaFunction = Array<{|
  schema_name: ?String,
  language: ?String,
  returns_set: ?Boolean,
  return_type_id: ?TypeId,
  id: ?FunctionId,
  name: ?String,
  return_type: ?String,
  definition: ?String,
  schema_id: ?SchemaId,
  parameters: ?String,
|}>;
type BundleStageRowDeleted = Array<{|
  id: String,
  rowset_row_id: ?String,
  bundle_id: String,
|}>;
type WidgetCore = Array<{|
  id: String,
  css: ?String,
  js: ?String,
  name: String,
  docs: ?String,
|}>;
type WidgetDep = Array<{|
  id: String,
  name: String,
  docs: ?String,
  js: ?String,
  css: ?String,
|}>;
type MetaCast = Array<{|
  source_type: ?String,
  implicit?: ?String,
  id: ?CastId,
  target_type: ?String,
  function: ?String,
|}>;
type WidgetWidgetDependencyCss = Array<{|
  id: String,
  widget_id: String,
  dependency_css_id: String,
|}>;
type WidgetWidgetName = Array<{|
  id: ?String,
  name: ?String,
|}>;
type BundleBundle = Array<{|
  id: String,
  name: ?String,
  head_commit_id: ?String,
|}>;
type PublicTest = Array<{|
  js: ?String,
  id: ?String,
  name: ?String,
|}>;
type EndpointSession = Array<{|
  id: String,
  user_id: ?String,
  role_id: RoleId,
|}>;
type EndpointMimetypeExtension = Array<{|
  id: String,
  mimetype_id: String,
  extension: ?String,
|}>;
type MetaTrigger = Array<{|
  relation_id: ?RelationId,
  schema_name: ?String,
  relation_name: ?String,
  truncate: ?Boolean,
  id: ?TriggerId,
  name: ?String,
  level: ?String,
  update: ?Boolean,
  when: ?String,
  delete: ?Boolean,
  function_id: ?FunctionId,
  insert: ?Boolean,
|}>;
type BundleIgnoredRow = Array<{|
  id: String,
  bundle_id: String,
  row_id: ?RowId,
|}>;
type MetaType = Array<{|
  schema_name: ?String,
  id: ?TypeId,
  name: ?String,
  description: ?String,
  composite: ?Boolean,
|}>;
type MetaOperator = Array<{|
  schema_name: ?String,
  description: ?String,
  result_type: ?String,
  id: ?OperatorId,
  name: ?String,
  right_arg_type: ?String,
  left_arg_type: ?String,
|}>;
type MetaForeignColumn = Array<{|
  schema_name: ?String,
  foreign_table_id: ?RelationId,
  id: ?ColumnId,
  nullable: ?Boolean,
  name: ?String,
  foreign_table_name: ?String,
  type: ?String,
|}>;
type MetaConstraintUnique = Array<{|
  schema_name: ?String,
  table_id: ?RelationId,
  id: ?ContraintId,
  column_ids: ?ColumnId,
  name: ?String,
  table_name: ?String,
  column_names: ?String,
|}>;
type BundleOffstageFieldChanged = Array<{|
  bundle_id: ?String,
  old_value: ?String,
  field_id: ?FieldId,
  new_value: ?String,
  row_id: ?RowId,
|}>;
type EndpointUser = Array<{|
  id: String,
  active: Boolean,
  activation_code: ?String,
  role_id: RoleId,
  name: String,
  email: String,
|}>;
type MetaForeignDataWrapper = Array<{|
  options: ?any,
  validator_id: ?FunctionId,
  id: ?ForeignDataWrapperId,
  handler_id: ?FunctionId,
  name: ?String,
|}>;
type MetaTablePrivilege = Array<{|
  relation_id: ?RelationId,
  schema_name: ?String,
  relation_name: ?String,
  role_name: ?String,
  with_hierarchy: ?String,
  id: ?TablePrivilegeId,
  role_id: ?RoleId,
  is_grantable: ?String,
  type: ?String,
|}>;
type BundleStageRowField = Array<{|
  field_id: ?FieldId,
  stage_row_id: ?RowId,
  value: ?String,
|}>;
type BundleHeadDbStage = Array<{|
  staged: ?Boolean,
  in_head: ?Boolean,
  offstage_field_changes_old_vals: ?String,
  bundle_id: ?String,
  offstage_field_changes: ?FieldId,
  head_row_id: ?RowId,
  commit_id: ?String,
  stage_row_id: ?RowId,
  row_id: ?RowId,
  change_type: ?String,
  row_exists: ?Boolean,
  stage_field_changes_old_vals: ?String,
  offstage_field_changes_new_vals: ?String,
  stage_field_changes: ?FieldId,
  stage_field_changes_new_vals: ?String,
|}>;
type BundleBlob = Array<{|
  hash: ?String,
  value: ?String,
|}>;
type BundleTrackedRow = Array<{|
  bundle_id: ?String,
  row_id: ?RowId,
|}>;
type BundleStageRow = Array<{|
  new_row: ?Boolean,
  bundle_id: ?String,
  row_id: ?RowId,
|}>;
type WidgetWidgetDependencyJs = Array<{|
  id: String,
  widget_id: String,
  dependency_js_id: String,
|}>;
type BundleStageRowAdded = Array<{|
  id: String,
  row_id: ?RowId,
  bundle_id: String,
|}>;
type TestUser = Array<{|
  age: String,
  id: String,
  name: String,
|}>;
type WidgetMachine = Array<{|
  id: String,
|}>;
type BundleRowsetRow = Array<{|
  id: String,
  row_id: ?RowId,
  rowset_id: ?String,
|}>;
type EndpointSitemap = Array<{|
  js: ?String,
  path: ?String,
  mimetype: ?String,
  name: ?String,
  content: ?String,
|}>;
type BundleUntrackedRow = Array<{|
  relation_id: ?RelationId,
  row_id: ?RowId,
|}>;
type MetaPolicyRole = Array<{|
  relation_id: ?RelationId,
  schema_name: ?String,
  relation_name: ?String,
  role_name: ?String,
  policy_id: ?PolicyId,
  id: ?String,
  role_id: ?RoleId,
  policy_name: ?String,
|}>;
type EndpointResourceFile = Array<{|
  id: String,
  file_id: String,
  active: ?Boolean,
  path: String,
|}>;
type EventSession = Array<{|
  id: String,
  owner_id: RoleId,
|}>;
type BundleIgnoredRelation = Array<{|
  relation_id: ?RelationId,
  meta_row_id: ?RowId,
|}>;
type SemanticsRelationPurpose = Array<{|
  id: String,
  purpose: String,
|}>;
type BundleNotIgnoredRelation = Array<{|
  relation_id: ?RelationId,
  primary_key_column_id: ?ColumnId,
  schema_id: ?SchemaId,
|}>;
type MetaTable = Array<{|
  schema_name: ?String,
  id: ?RelationId,
  name: ?String,
  schema_id: ?SchemaId,
|}>;
type EndpointResourceDirectory = Array<{|
  id: String,
  indexes: ?Boolean,
  path: ?String,
  directory_id: ?String,
|}>;
type BundleCommit = Array<{|
  id: String,
  bundle_id: ?String,
  rowset_id: ?String,
  message: ?String,
  parent_id: ?String,
  role_id: ?RoleId,
  time: String,
|}>;
type MetaView = Array<{|
  schema_name: ?String,
  id: ?RelationId,
  name: ?String,
  schema_id: ?SchemaId,
  query: ?String,
|}>;
type BundleRowsetRowField = Array<{|
  id: String,
  rowset_row_id: ?String,
  field_id: ?FieldId,
  value_hash: ?String,
|}>;
type EndpointResource = Array<{|
  id: String,
  content: String,
  mimetype_id: String,
  js: ?String,
  path: String,
  active: ?Boolean,
|}>;
type EventSubscriptionRow = Array<{|
  id: String,
  row_id: ?RowId,
  session_id: String,
  created_at: String,
|}>;
type EndpointCurrentUser = Array<{|
  current_user: ?String,
|}>;
type WidgetDependencyCss = Array<{|
  id: String,
  version: String,
  content: String,
  name: String,
|}>;
type BundleOffstageRowDeletedBySchema = Array<{|
  schema_name: ?String,
  count: ?Integer,
  schema_id: ?SchemaId,
|}>;
type BundleRemoteDatabase = Array<{|
  schema_name: ?String,
  id: String,
  host: ?String,
  password: ?String,
  username: ?String,
  port: ?Integer,
  foreign_server_name: ?String,
  dbname: ?String,
|}>;
type BundleOffstageRowDeletedByRelation = Array<{|
  relation_id: ?RelationId,
  schema_name: ?String,
  count: ?Integer,
  relation_name: ?String,
  schema_id: ?SchemaId,
|}>;
type EventSubscriptionField = Array<{|
  id: String,
  field_id: ?FieldId,
  created_at: String,
  session_id: String,
|}>;
type EventSubscription = Array<{|
  relation_id: ?RelationId,
  field_id: ?FieldId,
  session_id: ?String,
  column_id: ?ColumnId,
  row_id: ?RowId,
  id: ?String,
  type: ?String,
|}>;
type WidgetCommon = Array<{|
  id: String,
  js: ?String,
  css: ?String,
  docs: ?String,
  name: String,
|}>;
type WidgetWidgetFsm = Array<{|
  id: String,
  widget_id: String,
  machine_id: ?String,
|}>;
type WidgetDependencyJs = Array<{|
  id: String,
  content: String,
  name: String,
  version: String,
  variable: ?String,
|}>;
type WidgetWidget = Array<{|
  id: String,
  html: String,
  name: String,
  pre_js: String,
  css: String,
  help: ?String,
  post_js: String,
|}>;
type BundleHeadCommitRow = Array<{|
  bundle_id: ?String,
  commit_id: ?String,
  row_id: ?RowId,
|}>;
type WidgetType = Array<{|
  schema_name: ?String,
  relation_name: ?String,
  nullable: ?any,
  columns: ?any,
|}>;
type WidgetBundledWidget = Array<{|
  post_js: ?String,
  help: ?String,
  pre_js: ?String,
  id: ?String,
  css: ?String,
  html: ?String,
  name: ?String,
  bundle_name: ?String,
|}>;
type EndpointColumnMimetype = Array<{|
  id: String,
  mimetype_id: String,
  column_id: ColumnId,
|}>;
type BundleIgnoredSchema = Array<{|
  schema_id: ?SchemaId,
  meta_row_id: ?RowId,
|}>;
type BundleUntrackedRowBySchema = Array<{|
  schema_name: ?String,
  count: ?Integer,
  schema_id: ?SchemaId,
|}>;
type MetaConnection = Array<{|
  last_query: ?String,
  client_port: ?Integer,
  last_state_change: ?String,
  database_name: ?String,
  application_name: ?String,
  transaction_start: ?String,
  client_ip: ?String,
  id: ?ConnectionId,
  query_start: ?String,
  unix_pid: ?Integer,
  role_id: ?RoleId,
  state: ?String,
  connection_start: ?String,
  client_hostname: ?String,
  wait_event: ?String,
  wait_event_type: ?String,
|}>;
type SemanticsRelation = Array<{|
  id: String,
  purpose_id: String,
  relation_id: RelationId,
  priority: Integer,
  widget_id: String,
|}>;
type BundleHeadDbStageChanged = Array<{|
  staged: ?Boolean,
  in_head: ?Boolean,
  offstage_field_changes_old_vals: ?String,
  bundle_id: ?String,
  offstage_field_changes: ?FieldId,
  head_row_id: ?RowId,
  commit_id: ?String,
  stage_row_id: ?RowId,
  row_id: ?RowId,
  change_type: ?String,
  row_exists: ?Boolean,
  stage_field_changes_old_vals: ?String,
  offstage_field_changes_new_vals: ?String,
  stage_field_changes: ?FieldId,
  stage_field_changes_new_vals: ?String,
|}>;
type MetaForeignServer = Array<{|
  options: ?any,
  id: ?ForeignServerId,
  version: ?String,
  name: ?String,
  type: ?String,
  foreign_data_wrapper_id: ?ForeignDataWrapperId,
|}>;
type WidgetInput = Array<{|
  id: String,
  name: String,
  widget_id: String,
  optional: Boolean,
  default_value: ?String,
  doc_string: ?String,
  help: ?String,
  test_value: ?String,
|}>;
type MetaRole = Array<{|
  create_db: ?Boolean,
  connection_limit: ?Integer,
  can_login: ?Boolean,
  create_role: ?Boolean,
  id: ?RoleId,
  name: ?String,
  replication: ?Boolean,
  inherit: ?Boolean,
  password: ?String,
  valid_until: ?String,
  superuser: ?Boolean,
|}>;
type MetaPolicy = Array<{|
  relation_id: ?RelationId,
  schema_name: ?String,
  relation_name: ?String,
  command: ?Suida,
  id: ?PolicyId,
  name: ?String,
  check: ?String,
  using: ?String,
|}>;
type MetaConstraintCheck = Array<{|
  check_clause: ?String,
  schema_name: ?String,
  table_id: ?RelationId,
  id: ?ContraintId,
  name: ?String,
  table_name: ?String,
|}>;
type PresSlide = Array<{|
  id: String,
  name: String,
  number: Integer,
  markdown: ?String,
|}>;
type BundleHeadCommitRowWithExists = Array<{|
  bundle_id: ?String,
  commit_id: ?String,
  row_id: ?RowId,
  exists: ?Boolean,
|}>;
type BundleHeadCommitField = Array<{|
  bundle_id: ?String,
  field_id: ?FieldId,
  row_id: ?RowId,
  value_hash: ?String,
|}>;
type BundleRemote = Array<{|
  id: String,
  bundle_id: String,
  endpoint_id: String,
  push: Boolean,
|}>;
type EndpointResourceText = Array<{|
  id: String,
  path: String,
  active: ?Boolean,
  mimetype_id: String,
  content: String,
|}>;
type SemanticsType = Array<{|
  id: String,
  purpose_id: String,
  priority: Integer,
  type_id: ?TypeId,
  widget_id: String,
|}>;
export type SelectType = (('ide.foreign_key') => Promise<IdeForeignKey>) &
  (('meta.foreign_table') => Promise<MetaForeignTable>) &
  ((
    'bundle.untracked_row_by_relation',
  ) => Promise<BundleUntrackedRowByRelation>) &
  (('bundle.stage_field_changed') => Promise<BundleStageFieldChanged>) &
  (('endpoint.mimetype') => Promise<EndpointMimetype>) &
  (('meta.role_inheritance') => Promise<MetaRoleInheritance>) &
  ((
    'endpoint.function_field_mimetype',
  ) => Promise<EndpointFunctionFieldMimetype>) &
  (('event.subscription_table') => Promise<EventSubscriptionTable>) &
  (('meta.sequence') => Promise<MetaSequence>) &
  (('bundle.tracked_row_added') => Promise<BundleTrackedRowAdded>) &
  (('event.subscription_column') => Promise<EventSubscriptionColumn>) &
  (('endpoint.remote_endpoint') => Promise<EndpointRemoteEndpoint>) &
  (('bundle.not_ignored_row_stmt') => Promise<BundleNotIgnoredRowStmt>) &
  (('bundle.rowset') => Promise<BundleRowset>) &
  (('meta.extension') => Promise<MetaExtension>) &
  (('pres.component') => Promise<PresComponent>) &
  (('meta.relation') => Promise<MetaRelation>) &
  (('widget.component') => Promise<WidgetComponent>) &
  (('meta.column') => Promise<MetaColumn>) &
  (('semantics.column_purpose') => Promise<SemanticsColumnPurpose>) &
  (('semantics.column') => Promise<SemanticsColumn>) &
  (('ide.bundle_contained_relation') => Promise<IdeBundleContainedRelation>) &
  (('semantics.foreign_key') => Promise<SemanticsForeignKey>) &
  (('endpoint.resource_binary') => Promise<EndpointResourceBinary>) &
  (('event.event') => Promise<EventEvent>) &
  (('meta.function_parameter') => Promise<MetaFunctionParameter>) &
  (('widget.widget_view') => Promise<WidgetWidgetView>) &
  (('meta.schema') => Promise<MetaSchema>) &
  (('meta.foreign_key') => Promise<MetaForeignKey>) &
  (('bundle.offstage_row_deleted') => Promise<BundleOffstageRowDeleted>) &
  (('meta.function') => Promise<MetaFunction>) &
  (('bundle.stage_row_deleted') => Promise<BundleStageRowDeleted>) &
  (('widget.core') => Promise<WidgetCore>) &
  (('widget.dep') => Promise<WidgetDep>) &
  (('meta.cast') => Promise<MetaCast>) &
  (('widget.widget_dependency_css') => Promise<WidgetWidgetDependencyCss>) &
  (('widget.widget_name') => Promise<WidgetWidgetName>) &
  (('bundle.bundle') => Promise<BundleBundle>) &
  (('public.test') => Promise<PublicTest>) &
  (('endpoint.session') => Promise<EndpointSession>) &
  (('endpoint.mimetype_extension') => Promise<EndpointMimetypeExtension>) &
  (('meta.trigger') => Promise<MetaTrigger>) &
  (('bundle.ignored_row') => Promise<BundleIgnoredRow>) &
  (('meta.type') => Promise<MetaType>) &
  (('meta.operator') => Promise<MetaOperator>) &
  (('meta.foreign_column') => Promise<MetaForeignColumn>) &
  (('meta.constraint_unique') => Promise<MetaConstraintUnique>) &
  (('bundle.offstage_field_changed') => Promise<BundleOffstageFieldChanged>) &
  (('endpoint.user') => Promise<EndpointUser>) &
  (('meta.foreign_data_wrapper') => Promise<MetaForeignDataWrapper>) &
  (('meta.table_privilege') => Promise<MetaTablePrivilege>) &
  (('bundle.stage_row_field') => Promise<BundleStageRowField>) &
  (('bundle.head_db_stage') => Promise<BundleHeadDbStage>) &
  (('bundle.blob') => Promise<BundleBlob>) &
  (('bundle.tracked_row') => Promise<BundleTrackedRow>) &
  (('bundle.stage_row') => Promise<BundleStageRow>) &
  (('widget.widget_dependency_js') => Promise<WidgetWidgetDependencyJs>) &
  (('bundle.stage_row_added') => Promise<BundleStageRowAdded>) &
  (('test.user') => Promise<TestUser>) &
  (('widget.machine') => Promise<WidgetMachine>) &
  (('bundle.rowset_row') => Promise<BundleRowsetRow>) &
  (('endpoint.sitemap') => Promise<EndpointSitemap>) &
  (('bundle.untracked_row') => Promise<BundleUntrackedRow>) &
  (('meta.policy_role') => Promise<MetaPolicyRole>) &
  (('endpoint.resource_file') => Promise<EndpointResourceFile>) &
  (('event.session') => Promise<EventSession>) &
  (('bundle.ignored_relation') => Promise<BundleIgnoredRelation>) &
  (('semantics.relation_purpose') => Promise<SemanticsRelationPurpose>) &
  (('bundle.not_ignored_relation') => Promise<BundleNotIgnoredRelation>) &
  (('meta.table') => Promise<MetaTable>) &
  (('endpoint.resource_directory') => Promise<EndpointResourceDirectory>) &
  (('bundle.commit') => Promise<BundleCommit>) &
  (('meta.view') => Promise<MetaView>) &
  (('bundle.rowset_row_field') => Promise<BundleRowsetRowField>) &
  (('endpoint.resource') => Promise<EndpointResource>) &
  (('event.subscription_row') => Promise<EventSubscriptionRow>) &
  (('endpoint.current_user') => Promise<EndpointCurrentUser>) &
  (('widget.dependency_css') => Promise<WidgetDependencyCss>) &
  ((
    'bundle.offstage_row_deleted_by_schema',
  ) => Promise<BundleOffstageRowDeletedBySchema>) &
  (('bundle.remote_database') => Promise<BundleRemoteDatabase>) &
  ((
    'bundle.offstage_row_deleted_by_relation',
  ) => Promise<BundleOffstageRowDeletedByRelation>) &
  (('event.subscription_field') => Promise<EventSubscriptionField>) &
  (('event.subscription') => Promise<EventSubscription>) &
  (('widget.common') => Promise<WidgetCommon>) &
  (('widget.widget_fsm') => Promise<WidgetWidgetFsm>) &
  (('widget.dependency_js') => Promise<WidgetDependencyJs>) &
  (('widget.widget') => Promise<WidgetWidget>) &
  (('bundle.head_commit_row') => Promise<BundleHeadCommitRow>) &
  (('widget.type') => Promise<WidgetType>) &
  (('widget.bundled_widget') => Promise<WidgetBundledWidget>) &
  (('endpoint.column_mimetype') => Promise<EndpointColumnMimetype>) &
  (('bundle.ignored_schema') => Promise<BundleIgnoredSchema>) &
  (('bundle.untracked_row_by_schema') => Promise<BundleUntrackedRowBySchema>) &
  (('meta.connection') => Promise<MetaConnection>) &
  (('semantics.relation') => Promise<SemanticsRelation>) &
  (('bundle.head_db_stage_changed') => Promise<BundleHeadDbStageChanged>) &
  (('meta.foreign_server') => Promise<MetaForeignServer>) &
  (('widget.input') => Promise<WidgetInput>) &
  (('meta.role') => Promise<MetaRole>) &
  (('meta.policy') => Promise<MetaPolicy>) &
  (('meta.constraint_check') => Promise<MetaConstraintCheck>) &
  (('pres.slide') => Promise<PresSlide>) &
  ((
    'bundle.head_commit_row_with_exists',
  ) => Promise<BundleHeadCommitRowWithExists>) &
  (('bundle.head_commit_field') => Promise<BundleHeadCommitField>) &
  (('bundle.remote') => Promise<BundleRemote>) &
  (('endpoint.resource_text') => Promise<EndpointResourceText>) &
  (('semantics.type') => Promise<SemanticsType>);
