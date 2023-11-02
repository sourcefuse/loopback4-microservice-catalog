import {TerraformModule, TerraformModuleUserConfig} from 'cdktf';
import {Construct} from 'constructs';
export interface RedisConfig extends TerraformModuleUserConfig {
  /**
     * A list of Security Group rule objects to add to the created security group, in addition to the ones
  this module normally creates. (To suppress the module's rules, set `create_security_group` to false
  and supply your own security group via `associated_security_group_ids`.)
  The keys and values of the objects are fully compatible with the `aws_security_group_rule` resource, except
  for `security_group_id` which will be ignored, and the optional "key" which, if provided, must be unique and known at "plan" time.
  To get more info see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule .
  
     * @default
     */
  readonly additionalSecurityGroupRules?: any[];
  /**
     * Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.
  This is for some rare cases where resources want additional configuration of tags
  and therefore take a list of maps with tag key, value, and additional configuration.
  
     * @default [object Object]
     * The property type contains a map, they have special handling, please see {@link cdk.tf/module-map-inputs the docs}
     */
  readonly additionalTagMap?: {
    [key: string]: string;
  };
  /**
   * Alarm action list
   * @default
   */
  readonly alarmActions?: string[];
  /**
   * CPU threshold alarm level
   * @default 75
   */
  readonly alarmCpuThresholdPercent?: number;
  /**
   * Ram threshold alarm level
   * @default 10000000
   */
  readonly alarmMemoryThresholdBytes?: number;
  /**
     * If `true`, the created security group will allow egress on all ports and protocols to all IP address.
  If this is false and no egress rules are otherwise specified, then no egress will be allowed.
  Defaults to `true` unless the deprecated `egress_cidr_blocks` is provided and is not `["0.0.0.0/0"]`, in which case defaults to `false`.
  
     */
  readonly allowAllEgress?: boolean;
  /**
     * DEPRECATED: Use `additional_security_group_rules` instead.
  Historical description: List of CIDR blocks that are allowed ingress to the cluster's Security Group created in the module
  
     * @default
     */
  readonly allowedCidrBlocks?: string[];
  /**
     * A list of IDs of Security Groups to allow access to the security group created by this module.
  
     * @default
     */
  readonly allowedSecurityGroupIds?: string[];
  /**
     * DEPRECATED: Use `allowed_security_group_ids` instead.
  
     * @default
     */
  readonly allowedSecurityGroups?: string[];
  /**
   * Apply changes immediately
   * @default true
   */
  readonly applyImmediately?: boolean;
  /**
     * A list of IDs of Security Groups to associate the created resource with, in addition to the created security group.
  These security groups will not be modified and, if `create_security_group` is `false`, must provide all the required access.
  
     * @default
     */
  readonly associatedSecurityGroupIds?: string[];
  /**
   * Enable encryption at rest
   */
  readonly atRestEncryptionEnabled?: boolean;
  /**
     * ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,
  in the order they appear in the list. New attributes are appended to the
  end of the list. The elements of the list are joined by the `delimiter`
  and treated as a single ID element.
  
     * @default
     */
  readonly attributes?: string[];
  /**
   * Auth token for password protecting redis, `transit_encryption_enabled` must be set to `true`. Password must be longer than 16 chars
   */
  readonly authToken?: string;
  /**
   * Specifies whether minor version engine upgrades will be applied automatically to the underlying Cache Cluster instances during the maintenance window. Only supported if the engine version is 6 or higher.
   */
  readonly autoMinorVersionUpgrade?: boolean;
  /**
   * Automatic failover (Not available for T1/T2 instances)
   */
  readonly automaticFailoverEnabled?: boolean;
  /**
   * Availability zone IDs
   * @default
   */
  readonly availabilityZones?: string[];
  /**
   * Boolean flag to enable/disable CloudWatch metrics alarms
   */
  readonly cloudwatchMetricAlarmsEnabled?: boolean;
  /**
   * Flag to enable/disable creation of a native redis cluster. `automatic_failover_enabled` must be set to `true`. Only 1 `cluster_mode` block is allowed
   */
  readonly clusterModeEnabled?: boolean;
  /**
   * Number of node groups (shards) for this Redis replication group. Changing this number will trigger an online resizing operation before other settings modifications
   */
  readonly clusterModeNumNodeGroups?: number;
  /**
   * Number of replica nodes in each node group. Valid values are 0 to 5. Changing this number will force a new resource
   */
  readonly clusterModeReplicasPerNodeGroup?: number;
  /**
   * Number of nodes in cluster. *Ignored when `cluster_mode_enabled` == `true`*
   * @default 1
   */
  readonly clusterSize?: number;
  /**
     * Single object for setting entire context at once.
  See description of individual variables for details.
  Leave string and numeric variables as `null` to use default value.
  Individual variable settings (non-null) override settings in context object,
  except for attributes, tags, and additional_tag_map, which are merged.
  
     * @default [object Object]
     */
  readonly context?: any;
  /**
   * Set `true` to create and configure a new security group. If false, `associated_security_group_ids` must be provided.
   * @default true
   */
  readonly createSecurityGroup?: boolean;
  /**
   * Enables data tiering. Data tiering is only supported for replication groups using the r6gd node type.
   */
  readonly dataTieringEnabled?: boolean;
  /**
     * Delimiter to be used between ID elements.
  Defaults to `-` (hyphen). Set to `""` to use no delimiter at all.
  
     */
  readonly delimiter?: string;
  /**
   * Description of elasticache replication group
   */
  readonly description?: string;
  /**
     * Describe additional descriptors to be output in the `descriptors` output map.
  Map of maps. Keys are names of descriptors. Values are maps of the form
  `{
     format = string
     labels = list(string)
  }`
  (Type is `any` so the map values can later be enhanced to provide additional options.)
  `format` is a Terraform format string to be passed to the `format()` function.
  `labels` is a list of labels, in order, to pass to `format()` function.
  Label values will be normalized before being passed to `format()` so they will be
  identical to how they appear in `id`.
  Default is `{}` (`descriptors` output will be empty).
  
     * @default [object Object]
     */
  readonly descriptorFormats?: any;
  /**
   * The subdomain to use for the CNAME record. If not provided then the CNAME record will use var.name.
   */
  readonly dnsSubdomain?: string;
  /**
     * DEPRECATED: Use `allow_all_egress` and `additional_security_group_rules` instead.
  Historical description: Outbound traffic address.
  Historical default: ["0.0.0.0/0"]
  
     */
  readonly egressCidrBlocks?: any[];
  /**
   * Subnet group name for the ElastiCache instance
   */
  readonly elasticacheSubnetGroupName?: string;
  /**
   * Set to false to prevent the module from creating any resources
   */
  readonly enabled?: boolean;
  /**
   * Redis engine version
   * @default 4.0.10
   */
  readonly engineVersion?: string;
  /**
   * ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT'
   */
  readonly environment?: string;
  /**
     * DEPRECATED: Use `associated_security_group_ids` instead.
  Historical description: List of existing Security Group IDs to place the cluster into.
  Set `use_existing_security_groups` to `true` to enable using `existing_security_groups` as Security Groups for the cluster.
  
     * @default
     */
  readonly existingSecurityGroups?: string[];
  /**
   * Redis family
   * @default redis4.0
   */
  readonly family?: string;
  /**
   * The name of your final node group (shard) snapshot. ElastiCache creates the snapshot from the primary node in the cluster. If omitted, no final snapshot will be made.
   */
  readonly finalSnapshotIdentifier?: string;
  /**
     * Limit `id` to this many characters (minimum 6).
  Set to `0` for unlimited length.
  Set to `null` for keep the existing setting, which defaults to `0`.
  Does not affect `id_full`.
  
     */
  readonly idLengthLimit?: number;
  /**
   * Elastic cache instance type
   * @default cache.t2.micro
   */
  readonly instanceType?: string;
  /**
   * The ARN of the key that you wish to use if encrypting at rest. If not supplied, uses service managed encryption. `at_rest_encryption_enabled` must be set to `true`
   */
  readonly kmsKeyId?: string;
  /**
     * Controls the letter case of the `tags` keys (label names) for tags generated by this module.
  Does not affect keys of tags passed in via the `tags` input.
  Possible values: `lower`, `title`, `upper`.
  Default value: `title`.
  
     */
  readonly labelKeyCase?: string;
  /**
     * The order in which the labels (ID elements) appear in the `id`.
  Defaults to ["namespace", "environment", "stage", "name", "attributes"].
  You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present.
  
     */
  readonly labelOrder?: string[];
  /**
     * Controls the letter case of ID elements (labels) as included in `id`,
  set as tag values, and output by this module individually.
  Does not affect values of tags passed in via the `tags` input.
  Possible values: `lower`, `title`, `upper` and `none` (no transformation).
  Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.
  Default value: `lower`.
  
     */
  readonly labelValueCase?: string;
  /**
     * Set of labels (ID elements) to include as tags in the `tags` output.
  Default is to include all labels.
  Tags with empty values will not be included in the `tags` output.
  Set to `[]` to suppress all generated tags.
  **Notes:**
    The value of the `name` tag, if included, will be the `id`, not the `name`.
    Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be
    changed in later chained modules. Attempts to change it will be silently ignored.
  
     * @default default
     */
  readonly labelsAsTags?: string[];
  /**
   * The log_delivery_configuration block allows the streaming of Redis SLOWLOG or Redis Engine Log to CloudWatch Logs or Kinesis Data Firehose. Max of 2 blocks.
   * @default
   * The property type contains a map, they have special handling, please see {@link cdk.tf/module-map-inputs the docs}
   */
  readonly logDeliveryConfiguration?: {
    [key: string]: any;
  }[];
  /**
   * Maintenance window
   * @default wed:03:00-wed:04:00
   */
  readonly maintenanceWindow?: string;
  /**
   * Multi AZ (Automatic Failover must also be enabled.  If Cluster Mode is enabled, Multi AZ is on by default, and this setting is ignored)
   */
  readonly multiAzEnabled?: boolean;
  /**
     * ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.
  This is the only ID element not also included as a `tag`.
  The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input.
  
     */
  readonly name?: string;
  /**
   * ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique
   */
  readonly namespace?: string;
  /**
   * Notification topic arn
   */
  readonly notificationTopicArn?: string;
  /**
   * The list of actions to execute when this alarm transitions into an OK state from any other state. Each action is specified as an Amazon Resource Number (ARN)
   * @default
   */
  readonly okActions?: string[];
  /**
   * A list of Redis parameters to apply. Note that parameters may differ from one Redis family to another
   * @default
   */
  readonly parameter?: any;
  /**
   * Managed by Terraform
   */
  readonly parameterGroupDescription?: string;
  /**
   * Redis port
   * @default 6379
   */
  readonly port?: number;
  /**
     * Terraform regular expression (regex) string.
  Characters matching the regex will be removed from the ID elements.
  If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits.
  
     */
  readonly regexReplaceChars?: string;
  /**
     * Replication group ID with the following constraints:
  A name must contain from 1 to 20 alphanumeric characters or hyphens.
   The first character must be a letter.
   A name cannot end with a hyphen or contain two consecutive hyphens.
     */
  readonly replicationGroupId?: string;
  /**
     * Set `true` to enable Terraform `create_before_destroy` behavior on the created security group.
  We only recommend setting this `false` if you are upgrading this module and need to keep
  the existing security group from being replaced.
  Note that changing this value will always cause the security group to be replaced.
  
     * @default true
     */
  readonly securityGroupCreateBeforeDestroy?: boolean;
  /**
   * How long to wait for the security group to be created.
   * @default 10m
   */
  readonly securityGroupCreateTimeout?: string;
  /**
     * How long to retry on `DependencyViolation` errors during security group deletion.
  
     * @default 15m
     */
  readonly securityGroupDeleteTimeout?: string;
  /**
     * The description to assign to the created Security Group.
  Warning: Changing the description causes the security group to be replaced.
  Set this to `null` to maintain parity with releases <= `0.34.0`.
  
     * @default Security group for Elasticache Redis
     */
  readonly securityGroupDescription?: string;
  /**
     * The name to assign to the created security group. Must be unique within the VPC.
  If not provided, will be derived from the `null-label.context` passed in.
  If `create_before_destroy` is true, will be used as a name prefix.
  
     * @default
     */
  readonly securityGroupName?: string[];
  /**
   * A single-element string list containing an Amazon Resource Name (ARN) of a Redis RDB snapshot file stored in Amazon S3. Example: arn:aws:s3:::my_bucket/snapshot1.rdb
   * @default
   */
  readonly snapshotArns?: string[];
  /**
   * The name of a snapshot from which to restore data into the new node group. Changing the snapshot_name forces a new resource.
   */
  readonly snapshotName?: string;
  /**
   * The number of days for which ElastiCache will retain automatic cache cluster snapshots before deleting them.
   */
  readonly snapshotRetentionLimit?: number;
  /**
   * The daily time range (in UTC) during which ElastiCache will begin taking a daily snapshot of your cache cluster.
   * @default 06:30-07:30
   */
  readonly snapshotWindow?: string;
  /**
   * ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release'
   */
  readonly stage?: string;
  /**
   * Subnet IDs
   * @default
   */
  readonly subnets?: string[];
  /**
     * Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).
  Neither the tag keys nor the tag values will be modified by this module.
  
     * @default [object Object]
     * The property type contains a map, they have special handling, please see {@link cdk.tf/module-map-inputs the docs}
     */
  readonly tags?: {
    [key: string]: string;
  };
  /**
   * ID element _(Rarely used, not included by default)_. A customer identifier, indicating who this instance of a resource is for
   */
  readonly tenant?: string;
  /**
     * Set `true` to enable encryption in transit. Forced `true` if `var.auth_token` is set.
  If this is enabled, use the [following guide](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/in-transit-encryption.html#connect-tls) to access redis.
  
     * @default true
     */
  readonly transitEncryptionEnabled?: boolean;
  /**
     * DEPRECATED: Use `create_security_group` instead.
  Historical description: Flag to enable/disable creation of Security Group in the module.
  Set to `true` to disable Security Group creation and provide a list of existing security Group IDs in `existing_security_groups` to place the cluster into.
  Historical default: `false`
  
     */
  readonly useExistingSecurityGroups?: boolean;
  /**
   * User Group ID to associate with the replication group
   */
  readonly userGroupIds?: string[];
  /**
   * VPC ID
   */
  readonly vpcId: string;
  /**
     * Route53 DNS Zone ID as list of string (0 or 1 items). If empty, no custom DNS name will be published.
  If the list contains a single Zone ID, a custom DNS name will be pulished in that zone.
  Can also be a plain string, but that use is DEPRECATED because of Terraform issues.
  
     * @default
     */
  readonly zoneId?: any;
}
export declare class Redis extends TerraformModule {
  private readonly inputs;
  constructor(scope: Construct, id: string, config: RedisConfig);
  get additionalSecurityGroupRules(): any[] | undefined;
  set additionalSecurityGroupRules(value: any[] | undefined);
  get additionalTagMap():
    | {
        [key: string]: string;
      }
    | undefined;
  set additionalTagMap(
    value:
      | {
          [key: string]: string;
        }
      | undefined,
  );
  get alarmActions(): string[] | undefined;
  set alarmActions(value: string[] | undefined);
  get alarmCpuThresholdPercent(): number | undefined;
  set alarmCpuThresholdPercent(value: number | undefined);
  get alarmMemoryThresholdBytes(): number | undefined;
  set alarmMemoryThresholdBytes(value: number | undefined);
  get allowAllEgress(): boolean | undefined;
  set allowAllEgress(value: boolean | undefined);
  get allowedCidrBlocks(): string[] | undefined;
  set allowedCidrBlocks(value: string[] | undefined);
  get allowedSecurityGroupIds(): string[] | undefined;
  set allowedSecurityGroupIds(value: string[] | undefined);
  get allowedSecurityGroups(): string[] | undefined;
  set allowedSecurityGroups(value: string[] | undefined);
  get applyImmediately(): boolean | undefined;
  set applyImmediately(value: boolean | undefined);
  get associatedSecurityGroupIds(): string[] | undefined;
  set associatedSecurityGroupIds(value: string[] | undefined);
  get atRestEncryptionEnabled(): boolean | undefined;
  set atRestEncryptionEnabled(value: boolean | undefined);
  get attributes(): string[] | undefined;
  set attributes(value: string[] | undefined);
  get authToken(): string | undefined;
  set authToken(value: string | undefined);
  get autoMinorVersionUpgrade(): boolean | undefined;
  set autoMinorVersionUpgrade(value: boolean | undefined);
  get automaticFailoverEnabled(): boolean | undefined;
  set automaticFailoverEnabled(value: boolean | undefined);
  get availabilityZones(): string[] | undefined;
  set availabilityZones(value: string[] | undefined);
  get cloudwatchMetricAlarmsEnabled(): boolean | undefined;
  set cloudwatchMetricAlarmsEnabled(value: boolean | undefined);
  get clusterModeEnabled(): boolean | undefined;
  set clusterModeEnabled(value: boolean | undefined);
  get clusterModeNumNodeGroups(): number | undefined;
  set clusterModeNumNodeGroups(value: number | undefined);
  get clusterModeReplicasPerNodeGroup(): number | undefined;
  set clusterModeReplicasPerNodeGroup(value: number | undefined);
  get clusterSize(): number | undefined;
  set clusterSize(value: number | undefined);
  get context(): any | undefined;
  set context(value: any | undefined);
  get createSecurityGroup(): boolean | undefined;
  set createSecurityGroup(value: boolean | undefined);
  get dataTieringEnabled(): boolean | undefined;
  set dataTieringEnabled(value: boolean | undefined);
  get delimiter(): string | undefined;
  set delimiter(value: string | undefined);
  get description(): string | undefined;
  set description(value: string | undefined);
  get descriptorFormats(): any | undefined;
  set descriptorFormats(value: any | undefined);
  get dnsSubdomain(): string | undefined;
  set dnsSubdomain(value: string | undefined);
  get egressCidrBlocks(): any[] | undefined;
  set egressCidrBlocks(value: any[] | undefined);
  get elasticacheSubnetGroupName(): string | undefined;
  set elasticacheSubnetGroupName(value: string | undefined);
  get enabled(): boolean | undefined;
  set enabled(value: boolean | undefined);
  get engineVersion(): string | undefined;
  set engineVersion(value: string | undefined);
  get environment(): string | undefined;
  set environment(value: string | undefined);
  get existingSecurityGroups(): string[] | undefined;
  set existingSecurityGroups(value: string[] | undefined);
  get family(): string | undefined;
  set family(value: string | undefined);
  get finalSnapshotIdentifier(): string | undefined;
  set finalSnapshotIdentifier(value: string | undefined);
  get idLengthLimit(): number | undefined;
  set idLengthLimit(value: number | undefined);
  get instanceType(): string | undefined;
  set instanceType(value: string | undefined);
  get kmsKeyId(): string | undefined;
  set kmsKeyId(value: string | undefined);
  get labelKeyCase(): string | undefined;
  set labelKeyCase(value: string | undefined);
  get labelOrder(): string[] | undefined;
  set labelOrder(value: string[] | undefined);
  get labelValueCase(): string | undefined;
  set labelValueCase(value: string | undefined);
  get labelsAsTags(): string[] | undefined;
  set labelsAsTags(value: string[] | undefined);
  get logDeliveryConfiguration():
    | {
        [key: string]: any;
      }[]
    | undefined;
  set logDeliveryConfiguration(
    value:
      | {
          [key: string]: any;
        }[]
      | undefined,
  );
  get maintenanceWindow(): string | undefined;
  set maintenanceWindow(value: string | undefined);
  get multiAzEnabled(): boolean | undefined;
  set multiAzEnabled(value: boolean | undefined);
  get name(): string | undefined;
  set name(value: string | undefined);
  get namespace(): string | undefined;
  set namespace(value: string | undefined);
  get notificationTopicArn(): string | undefined;
  set notificationTopicArn(value: string | undefined);
  get okActions(): string[] | undefined;
  set okActions(value: string[] | undefined);
  get parameter(): any | undefined;
  set parameter(value: any | undefined);
  get parameterGroupDescription(): string | undefined;
  set parameterGroupDescription(value: string | undefined);
  get port(): number | undefined;
  set port(value: number | undefined);
  get regexReplaceChars(): string | undefined;
  set regexReplaceChars(value: string | undefined);
  get replicationGroupId(): string | undefined;
  set replicationGroupId(value: string | undefined);
  get securityGroupCreateBeforeDestroy(): boolean | undefined;
  set securityGroupCreateBeforeDestroy(value: boolean | undefined);
  get securityGroupCreateTimeout(): string | undefined;
  set securityGroupCreateTimeout(value: string | undefined);
  get securityGroupDeleteTimeout(): string | undefined;
  set securityGroupDeleteTimeout(value: string | undefined);
  get securityGroupDescription(): string | undefined;
  set securityGroupDescription(value: string | undefined);
  get securityGroupName(): string[] | undefined;
  set securityGroupName(value: string[] | undefined);
  get snapshotArns(): string[] | undefined;
  set snapshotArns(value: string[] | undefined);
  get snapshotName(): string | undefined;
  set snapshotName(value: string | undefined);
  get snapshotRetentionLimit(): number | undefined;
  set snapshotRetentionLimit(value: number | undefined);
  get snapshotWindow(): string | undefined;
  set snapshotWindow(value: string | undefined);
  get stage(): string | undefined;
  set stage(value: string | undefined);
  get subnets(): string[] | undefined;
  set subnets(value: string[] | undefined);
  get tags():
    | {
        [key: string]: string;
      }
    | undefined;
  set tags(
    value:
      | {
          [key: string]: string;
        }
      | undefined,
  );
  get tenant(): string | undefined;
  set tenant(value: string | undefined);
  get transitEncryptionEnabled(): boolean | undefined;
  set transitEncryptionEnabled(value: boolean | undefined);
  get useExistingSecurityGroups(): boolean | undefined;
  set useExistingSecurityGroups(value: boolean | undefined);
  get userGroupIds(): string[] | undefined;
  set userGroupIds(value: string[] | undefined);
  get vpcId(): string;
  set vpcId(value: string);
  get zoneId(): any | undefined;
  set zoneId(value: any | undefined);
  get arnOutput(): string;
  get clusterEnabledOutput(): string;
  get endpointOutput(): string;
  get engineVersionActualOutput(): string;
  get hostOutput(): string;
  get idOutput(): string;
  get memberClustersOutput(): string;
  get portOutput(): string;
  get readerEndpointAddressOutput(): string;
  get securityGroupIdOutput(): string;
  get securityGroupNameOutput(): string;
  protected synthesizeAttributes(): {
    [name: string]: any;
  };
}
