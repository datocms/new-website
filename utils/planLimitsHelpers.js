import prettyBytes from 'utils/prettyBytes';
import prettyNumber from 'utils/prettyNumber';
import SuccessIcon from 'public/icons/regular/check.svg';
import WarningIcon from 'public/icons/regular/times.svg';

export const hasUnit = (name) => {
  return (
    name.endsWith('days') || name.endsWith('seconds') || name.endsWith('bytes')
  );
};

export const limitLabel = (limit) => {
  if (limit === 'item_types') {
    return 'models';
  }

  if (limit === 'build_triggers') {
    return 'build triggers';
  }

  if (limit === 'traffic_bytes') {
    return 'traffic';
  }

  if (limit === 'api_calls') {
    return 'API calls';
  }

  if (limit === 'mux_encoding_seconds') {
    return 'uploaded footage';
  }

  if (limit === 'mux_streaming_seconds') {
    return 'video streaming time';
  }

  if (limit === 'items') {
    return 'records';
  }

  if (limit === 'uploadable_bytes') {
    return 'storage';
  }

  if (limit === 'users') {
    return 'collaborator';
  }

  if (limit === 'locales') {
    return 'locale';
  }

  if (limit === 'sites') {
    return 'project';
  }

  return limit;
};

export const formatValue = (name, value) => {
  if (name === 'support_level') {
    return value === 1 ? 'Community-based' : 'Mon/Fri, response in 24h';
  }

  if (name.endsWith('days')) {
    return `${value} days`;
  }

  if (name.endsWith('minutes')) {
    return `${value} minutes`;
  }

  if (name.endsWith('seconds')) {
    return value / 60 >= 5000
      ? `${parseInt(value / 60 / 60, 10)} hrs`
      : `${parseInt(value / 60, 10)} mins`;
  }

  if (name.endsWith('bytes')) {
    return prettyBytes(value);
  }

  return prettyNumber(value);
};

export const isHardLimit = (limit) =>
  ['activable_feature', 'boolean_system_limit'].includes(limit.type) &&
  limit.extraPacketAmount;

export const perMonth = (name, value) => {
  if (
    [
      'api_calls',
      'mux_encoding_seconds',
      'mux_streaming_seconds',
      'traffic_bytes',
    ].includes(name)
  ) {
    return `${value}/mo`;
  }

  return value;
};

export const formatLimit = (limit) => {
  if (
    [
      'activable_feature',
      'boolean_system_limit',
      'countable_system_limit',
      'possibly_incompatible_countable_system_limit',
    ].includes(limit.type)
  ) {
    return formatLimitRaw(limit);
  }

  if (
    limit.type === 'per_site_quota_managed_site_resource' ||
    limit.type === 'per_environment_quota_managed_site_resource'
  ) {
    return <>{formatLimitRaw(limit)} included per project</>;
  }

  return limit.extra_packet_amount ? (
    <>{formatLimitRaw(limit)} included</>
  ) : (
    <>{formatLimitRaw(limit)}</>
  );
};

const successIcon = (
  <div
    style={{
      backgroundColor: '#20d770',
      display: 'inline-block',
      fill: 'white',
      padding: '5px',
      borderRadius: '100px',
    }}
  >
    <SuccessIcon
      style={{
        fill: 'white',
        display: 'block',
      }}
    />
  </div>
);
const warningIcon = <WarningIcon style={{ fill: '#bebebecc' }} />;

export const formatLimitRaw = (limit) => {
  if (['activable_feature', 'boolean_system_limit'].includes(limit.type)) {
    return limit.available ? successIcon : warningIcon;
  }

  if (
    [
      'countable_system_limit',
      'possibly_incompatible_countable_system_limit',
    ].includes(limit.type)
  ) {
    return formatValue(limit.id, limit.limit);
  }

  if (limit.type === 'per_site_quota_managed_site_resource') {
    return perMonth(
      limit.id,
      formatValue(limit.id, limit.free_of_charge_per_site_usage),
    );
  }

  if (limit.type === 'per_environment_quota_managed_site_resource') {
    return perMonth(
      limit.id,
      formatValue(limit.id, limit.free_of_charge_per_environment_usage),
    );
  }

  return perMonth(limit.id, formatValue(limit.id, limit.free_of_charge_usage));
};

export const formatUpperBoundLimitRaw = (limit) => {
  const includedUsage =
    limit.type === 'per_site_quota_managed_site_resource'
      ? limit.free_of_charge_per_site_usage
      : limit.type === 'per_environment_quota_managed_site_resource'
      ? limit.free_of_charge_per_environment_usage
      : limit.free_of_charge_usage;

  return formatValue(
    limit.id,
    includedUsage + limit.max_extra_packets * limit.extra_packet_amount,
  );
};

export const formatExtra = (limit) => {
  if (!limit.extra_packet_amount) {
    return null;
  }

  return limit.extra_packet_amount === 1 ? (
    <>
      €{limit.extra_packet_price}/mo per extra {limitLabel(limit.id)}
    </>
  ) : (
    <>
      €{limit.extra_packet_price}/mo every{' '}
      {formatValue(limit.id, limit.extra_packet_amount)}
      {hasUnit(limit.id) ? ' of ' : ' '}
      extra {limitLabel(limit.id).replace(/_/g, ' ')}
    </>
  );
};
