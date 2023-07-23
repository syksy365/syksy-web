import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Tree, Modal } from 'antd';
import { useAccess, Access } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { addOrg, dataConversion, deleteOrg, editOrg, expandOrg, getList } from './service';
import styles from './index.less';

/**interface DataNode {
  value: string;
  defaultValue: string;
  key: string;
  expand: boolean;
  parentKey?: string;
  isEditable: boolean;
  menuVisible: boolean;
  buttonStyle: any;
  children?: DataNode[];
}**/

/**const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
  if (list == null) {
    return children;
  }
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
};**/

export default (props: any) => {
  const [data, setData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<any>();

  /**
   * 初始化加载全部数据
   */
  const onLoadData = async () => {
    const res = await getList();
    const initExpandedKeys = new Array<string>();
    const treeData = new Array<any>();
    dataConversion(res.data, treeData, initExpandedKeys);
    setExpandedKeys(initExpandedKeys);
    setData(treeData);
  };

  useEffect(() => {
    onLoadData();
  }, []);
  const { confirm } = Modal;
  const access = useAccess();

  const onMouseOverEvent = (item: any) => {
    if (item.buttonStyle.visibility !== 'visible') {
      item.buttonStyle = { visibility: 'visible', position: 'static' };
      setData(data.slice());
    }
  };
  const onMouseLeaveEvent = (item: any) => {
    if (!item.menuVisible) {
      item.buttonStyle = {
        visibility: 'hidden',
        position: 'absolute',
        right: 0,
      };
      setData(data.slice());
    }
  };

  const changeNode = (key: any, value: any, d: any) =>
    d.map((item: any) => {
      if (item.key === key) {
        item.value = value;
      }
      if (item.children) {
        changeNode(key, value, item.children);
      }
    });

  /**
   * 改变触发
   * @param e
   * @param key
   */
  const onChange = (e: any, key: any) => {
    changeNode(key, e.target.value, data);
    setData(data.slice());
  };

  const saveNode = (key: any, dataA: any) => {
    for (let i = 0; i < dataA.length; i++) {
      const item = dataA[i];
      if (item.key === key) {
        if (item.defaultValue === item.value) {
          if (key !== 'new') {
            item.isEditable = false;
            item.buttonStyle = {
              visibility: 'hidden',
              position: 'absolute',
              right: 0,
            };
            setData(data.slice());
            break;
          }
        }
        if (item.value.trim() === "") {
          item.value = item.defaultValue;
          item.isEditable = false;
          item.buttonStyle = {
            visibility: 'hidden',
            position: 'absolute',
            right: 0,
          };
          setData(data.slice());
          break;
        }
        item.defaultValue = item.value;
        if (item.isEditable) {
          if (key === 'new' && item.isEditable) {
            addOrg(item.value, item.parentKey).then((r: any) => {
              item.key = r.data;
              item.isEditable = false;
              item.buttonStyle = {
                visibility: 'hidden',
                position: 'absolute',
                right: 0,
              };
              setData(data.slice());
            });
          } else {
            editOrg(item.key, item.value).then(() => {
              item.isEditable = false;
              item.buttonStyle = {
                visibility: 'hidden',
                position: 'absolute',
                right: 0,
              };
              setData(data.slice());
            });
          }
          break;
        }
      }
      if (item.children) {
        saveNode(key, item.children);
      }
    }
  }
  /**
   * 保存触发
   * @param key
   */
  const onSave = (key: any) => {
    saveNode(key, data);
  };

  const editNode = (key: any, d: any) => {
    d.map((item: any) => {
      if (item.key === key) {
        item.isEditable = true;
      } else {
        item.isEditable = false;
      }
      item.value = item.defaultValue;
      if (item.children) {
        editNode(key, item.children);
      }
    });
  }


  const deepFirstSearch = (key: any) => {
    debugger;
    if (data != null) {
      const stack = [];
      data.forEach((d: any) => {
        stack.push(d);
      });
      while (stack.length != 0) {
        const item: any = stack.pop();
        if (item.key === key) {
          return item;
        }
        const children = item.children;
        if (children != null) {
          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
          }
        }
      }
    }
    return null;
  }
  /**
 * 编辑触发
 * @param e
 * @param key
 */
  const onEdit = (e: any, key: string) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    editNode(key, data);
    setData(data.slice());
  };
  const addNode = (key: string, d: any, id: any) =>
    d.map((item: any) => {
      if (item.key === key) {
        if (item.children) {
          item.children.push({
            value: '新组织',
            defaultValue: '新组织',
            key: id,
            parentKey: key,
            isEditable: false,
            buttonStyle: {
              visibility: 'hidden',
              position: 'absolute',
              right: 0,
            }
          });
        } else {
          item.children = [];
          item.children.push({
            value: '新组织',
            defaultValue: '新组织',
            key: id,
            parentKey: key,
            isEditable: false,
            buttonStyle: {
              visibility: 'hidden',
              position: 'absolute',
              right: 0,
            }
          });
        }
        return;
      }
      if (item.children) {
        addNode(key, item.children, id);
      }
    });
  /**
   * 新增触发
   * @param e
   */
  const onAdd = (e: any, item: any) => {
    const key = item.key;
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (expandedKeys.indexOf(key) === -1) {
      expandedKeys.push(key);
      setExpandedKeys(expandedKeys.slice());
    }
    const id = 'new';
    const a = deepFirstSearch(id);
    debugger;
    if (a) {
      return;
    }
    addNode(key, data, id);
    onEdit(e, id);
  };

  const deleteNode = (key: any, d: any) =>
    d.map((item: any, index: any) => {
      if (item.key === key) {
        d.splice(index, 1);
        return;
      } else {
        if (item.children) {
          deleteNode(key, item.children);
        }
      }
    });

  /**
   * 删除触发
   * @param key
   */
  const onDelete = (e: any, key: string) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteOrg(key);
        deleteNode(key, data);
        setData(data.slice());
      },
    });
  };

  /**
   * 标题
   * @param item
   */
  const renderTitle = (item: any) => {
    if (item.isEditable) {
      return (
        <div>
          <input
            className={styles.inputField}
            value={item.value}
            onChange={(e) => onChange(e, item.key)}
            onBlur={() => onSave(item.key)}
            onKeyUp={(e) => { if (e.nativeEvent.key === 'Enter') onSave(item.key) }}
            autoFocus={true}
          />
        </div>
      );
    } else {
      return (
        <div
          className={styles.titleContainer}
          onMouseOver={() => onMouseOverEvent(item)}
          onMouseLeave={() => onMouseLeaveEvent(item)}
        >
          <span className={styles.titleValue}>
            <span>{item.value}</span>
          </span>
          <span className={styles.operationField}>
            <Access accessible={access.canOperate("组织-新建")}>
              <span className={styles.buttonItem} style={item.buttonStyle}>
                <PlusOutlined onClick={(e) => onAdd(e, item)} title="新建子项" />
              </span>
            </Access>
            <Access accessible={access.canOperate("组织-重命名")}>
              <span className={styles.buttonItem} style={item.buttonStyle}>
                <EditOutlined onClick={(e) => onEdit(e, item.key)} title="重命名" />
              </span>
            </Access>
            <Access accessible={access.canOperate("组织-删除")}>
              <span className={styles.buttonItem} style={item.buttonStyle}>
                <DeleteOutlined onClick={(e) => onDelete(e, item.key)} title="删除" />
              </span>
            </Access>
          </span>
        </div>
      );
    }
  };

  /**
   * 展开关闭触发
   * @param expandedKeys
   * @param info
   */
  const onExpand = (ex: any, info: any) => {
    setExpandedKeys(ex);
    expandOrg(info.node.key, info.expanded);
  };

  /**
   * 拖动触发
   * @param info
   */
  const onDrop = (info: any) => {
    console.log(info);
  };

  return (
    <div className={styles}>
      <Tree
        blockNode={true}
        treeData={data}
        expandedKeys={expandedKeys}
        draggable
        titleRender={renderTitle}
        onSelect={props.onSelect}
        onDrop={onDrop}
        onExpand={onExpand}
      />
    </div>
  );
};
