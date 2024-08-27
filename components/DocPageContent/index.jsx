import cn from 'classnames';
import PluginSdkHook from 'components/PluginSdkHook';
import PostContent from 'components/PostContent';
import ReactUiExample from 'components/ReactUiExample';
import s from 'pages/docs/pageStyle.module.css';
import TriangleExclamationIcon from 'public/icons/regular/exclamation-triangle.svg';
import InfoCircleIcon from 'public/icons/regular/info-circle.svg';
import FaceSmileBeamIcon from 'public/icons/regular/smile.svg';
import WandMagicSparklesIcon from 'public/icons/regular/wand-magic.svg';
import { Fragment } from 'react';
import { StructuredText } from 'react-datocms';
import { FUNCTIONS_REFERENCE_ANCHOR_NAME } from '../../pages/docs/[...chunks]';
import Heading from '../Heading';

export default function DocPageContent({ additionalData, ...props }) {
  return (
    <PostContent
      {...props}
      renderBlock={(block) => {
        switch (block._modelApiKey) {
          case 'plugin_sdk_hook_group': {
            return (
              <>
                <hr />
                <Heading as="h3" anchor={FUNCTIONS_REFERENCE_ANCHOR_NAME}>
                  Function Reference
                </Heading>
                {additionalData.pluginSdkHooks
                  .sort((a, b) => a.lineNumber - b.lineNumber)
                  .map((hook) => (
                    <PluginSdkHook key={hook.name} hook={hook} />
                  ))}
              </>
            );
          }

          case 'doc_callout': {
            return (
              <div
                className={cn(
                  s.docCallout,
                  s[`docCallout--${block.calloutType}`],
                )}
                data-type={block.calloutType}
              >
                {block.title && (
                  <div className={s.docCalloutTitle}>
                    {block.calloutType === 'neutral' ? (
                      <InfoCircleIcon />
                    ) : block.calloutType === 'warning' ? (
                      <TriangleExclamationIcon />
                    ) : block.calloutType === 'positive' ? (
                      <FaceSmileBeamIcon />
                    ) : block.calloutType === 'protip' ? (
                      <WandMagicSparklesIcon />
                    ) : null}{' '}
                    <span>
                      {block.calloutType === 'protip' && 'Pro tip: '}
                      {block.title}
                    </span>
                  </div>
                )}
                <StructuredText data={block.text} />
              </div>
            );
          }
          case 'react_ui_live_example': {
            const examples = additionalData.allReactUiExamples.filter(
              (e) => e.componentName === block.componentName,
            );

            return (
              <>
                {examples.map((example) => (
                  <Fragment key={example.title}>
                    <h2>{example.title}</h2>
                    {example.description}
                    <ReactUiExample example={example} />
                  </Fragment>
                ))}
              </>
            );
          }
        }
      }}
    />
  );
}
