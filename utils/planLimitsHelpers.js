import prettyBytes from 'utils/prettyBytes';
import prettyNumber from 'utils/prettyNumber';

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
