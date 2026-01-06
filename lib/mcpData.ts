import { MCP } from '../types';

export const MCPS: MCP[] = [
  {
    id: 'master',
    name: 'Master Incident Manager MCP',
    description: 'Complete orchestrator that calls all service MCPs. One MCP to rule them all!',
    price: 50,
    features: [
      'Orchestrates all 8 service MCPs',
      'handle_incident()',
      'retry_failed_action()',
      'get_incident_status()'
    ],
    icon: '🎯',
    premium: true,
  },
  {
    id: 'discord',
    name: 'Discord MCP',
    description: 'Send alerts and notifications to Discord channels',
    price: 5,
    features: [
      'send_message()',
      'Discord API integration',
      'Webhook support'
    ],
    icon: '💬',
  },
  {
    id: 'slack',
    name: 'Slack MCP',
    description: 'Send messages to Slack channels and threads',
    price: 5,
    features: [
      'send_slack()',
      'Slack API integration',
      'Channel posting'
    ],
    icon: '💼',
  },
  {
    id: 'twilio',
    name: 'Twilio MCP',
    description: 'Send SMS notifications to on-call engineers',
    price: 5,
    features: [
      'send_sms()',
      'Twilio API integration',
      'Multi-number support'
    ],
    icon: '📱',
  },
  {
    id: 'warroom',
    name: 'War Room MCP',
    description: 'Create instant meeting rooms for incident response',
    price: 8,
    features: [
      'create_war_room()',
      'Google Meet integration',
      'Auto-generate links'
    ],
    icon: '📹',
  },
  {
    id: 'status',
    name: 'Status Page MCP',
    description: 'Update public status pages for customer transparency',
    price: 8,
    features: [
      'update_status()',
      'get_status()',
      'StatusPage.io integration'
    ],
    icon: '📊',
  },
  {
    id: 'oncall',
    name: 'OnCall Directory MCP',
    description: 'Fetch current on-call engineer from schedules',
    price: 7,
    features: [
      'get_oncall_engineer()',
      'PagerDuty API integration',
      'Team rotation support'
    ],
    icon: '👥',
  },
  {
    id: 'ai',
    name: 'AI Remediation MCP',
    description: 'Get AI-powered suggestions for incident resolution',
    price: 10,
    features: [
      'get_suggestions()',
      'Claude API integration',
      'Context-aware analysis'
    ],
    icon: '🧠',
  },
  {
    id: 'logger',
    name: 'Blockchain Logger MCP',
    description: 'Immutable incident logging on blockchain',
    price: 12,
    features: [
      'log_action()',
      'get_timeline()',
      'Tamper-proof audit trail'
    ],
    icon: '⛓️',
  }
];