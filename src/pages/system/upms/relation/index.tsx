import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { data } from './data';
import G6 from '@antv/g6';

export default (props: any) => {
  const ref = React.useRef(null);
  let graph: any = null;

  /**
   * 创建图
   */
  const createGraph = () => {

    //let data =  new Object;
    Object.assign(data, props.data);
    if (!graph && props.visible) {
      graph = new G6.TreeGraph({
        container: ref.current,
        width: document.documentElement.clientWidth - 48 - 32 || 1000,
        height: document.documentElement.clientHeight - 48 - 55 || 480,
        linkCenter: true,
        modes: {
          default: [
            {
              type: 'collapse-expand',
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          size: 26,
        },
        layout: {
          type: 'dendrogram', //dendrogram,compactBox
          direction: 'RL', // H / V / LR / RL / TB / BT
          getId: function getId(d: any) {
            return d.id;
          },
          getHeight: () => {
            return 100;
          },
          getWidth: () => {
            return 100;
          },
          getVGap: () => {
            return 150;
          },
          getHGap: () => {
            return 150;
          },
          radial: true,
        },
        fitView: true,
      });

      graph.node(function (node: any) {
        if (!node.children) {
          const deltaX = node.x - 0;
          const deltaY = node.y - 1;
          const rotate = Math.atan2(deltaY, deltaX);
          return {
            label: node.label,
            labelCfg: {
              position: 'center',
              style: {
                rotate,
                rotateCenter: 'lefttop',
                textAlign: 'start',
              },
            },
          };
        }
        return {
          label: node.label,
        };
      });

      graph.data(props.data);
      graph.render();
    }
  };

  useEffect(() => {
    createGraph();
  }, [props.visible]);



  const onCancel = () => {
    if (graph) {
      graph.destroy();
    }
    props.onCancel();
  };

  return (
    <Modal
      title="关系图"
      style={{ top: 0, paddingBottom: 0 }}
      visible={props.visible}
      onCancel={onCancel}
      footer={false}
      width={document.documentElement.clientWidth}
    >
      <div id="relationChart" ref={ref} />
    </Modal>
  );
};
