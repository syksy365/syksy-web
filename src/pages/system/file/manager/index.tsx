import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Input } from 'antd';
import { request } from '@umijs/max';
import {FolderOutlined,FileOutlined} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import Dashboard from '@uppy/dashboard';

import { DragDrop,ProgressBar,StatusBar,FileInput   } from '@uppy/react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

import '@uppy/core/dist/style.min.css'
import '@uppy/drag-drop/dist/style.min.css'
import '@uppy/progress-bar/dist/style.min.css'
import '@uppy/status-bar/dist/style.min.css'
import '@uppy/file-input/dist/style.css'
import { Target } from 'puppeteer-core';



const FileManagePage = () => {  
  const [files, setFiles] = useState([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [currentPath, setCurrentPath] = useState("app-upload-directory");
  const [modalVisibleFile, setModalVisibleFile] = useState(false);
  const [modalVisibleFolder, setModalVisibleFolder] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const uppy = new Uppy({ autoProceed: true,debug: true,})
  .use(Tus, {endpoint: '/qz/api/file/upload'});


  //在上传之前修改文件名
  uppy.on('file-added', (file) => {
    const currentFileName = file.name;

    const data = file.data;
    var modifiedFileName = null;
    const directory = currentPath;
     // 这是目录信息，根据实际情况设置
    if (data.webkitRelativePath !== null && data.webkitRelativePath !== ""){
      modifiedFileName = currentPath + "/" + data.webkitRelativePath;
    }else{
        modifiedFileName = `${currentPath}/${file.name}`;
    }
    console.log("====================================")
    console.log(modifiedFileName)
    uppy.setFileMeta(file.id, {
      name: modifiedFileName,
    });
  });

  // 当文件上传完成时的回调函数
  uppy.on('complete', (result) => {
    // `result.successful` 包含了上传成功的文件列表
    // 这里你可以执行你的回调操作
    getFiles(currentPath);
  });

  const getFiles = async (path) => {
    const response = await request('/qz/api/file/files', {
      method: 'get',
      params: { path: path },
    });
    setFiles(response.data.fileList);
    setCurrentPath(path);
  };

  const createFile = async () => {
    await request('/qz/api/file/createFile', {
      method: 'post',
      params: {
        path: currentPath,
        name: newFileName
      },

    });
    setNewFileName('');
    getFiles(currentPath);
    setModalVisibleFile(false);
  };

  const createFolder = async () => {
    await request('/qz/api/file/createFolder', {
      method: 'post',
      params: {
        path: currentPath,
        name: newFolderName
      },
    });
    setNewFolderName('');
    getFiles(currentPath);
    setModalVisibleFolder(false);
  };

  const uploadFile = (file) => {
    uppy.addFile({
      name: file.name,
      type: file.type,
      data: file,
    });
  };

  const uploadFolder = (folderInput) => {
    const files = [...folderInput.files];
    uppy.addFiles(files);
  };

  const handleCancel = () => {
    setModalVisibleFile(false); // 隐藏弹窗
    setModalVisibleFolder(false); // 隐藏弹窗
  };

  const handleDelete = async () =>{
    const response = await request('/qz/api/file/deleteFile', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',  // 设置请求头为 JSON
      },
      data: { paths: selectedRows },  // 使用 data 字段发送 JSON 数据
    });
    getFiles(currentPath);
  };

  const showDeleteModal = async (record) => {
    const response = await request('/qz/api/file/deleteFile', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',  // 设置请求头为 JSON
      },
      data: { paths: [record.path] },  // 使用 data 字段发送 JSON 数据
    });
    getFiles(currentPath);
  };

  const handleDownload = async (record) => {
    const response = await request('/qz/api/file/downloadFile', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',  // 设置请求头为 JSON
      },
      data: { paths: [record.path] },
      responseType: 'blob',
    });
    const blob = new Blob([response]);
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    const filename = record.name+".zip";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const handleDownloads = async () => {
    const response = await request('/qz/api/file/downloadFile', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',  // 设置请求头为 JSON
      },
      data: { paths: selectedRows },
      responseType: 'blob',
    });
    const blob = new Blob([response]);
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    const filename = "download.zip";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  

  useEffect(() => {
    getFiles(currentPath);
  }, []);

  const renderName = (name, record) => {
    const icon = record.type === 'folder' ? <FolderOutlined /> : <FileOutlined />;
    if (record.type === 'folder') {
      return (
      <span>
        {icon}
        {' '}
        <a onClick={() => getFiles(record.path)}>{name}</a>
      </span>
      );
    }
    return (
      <span>
        {icon}
        {' '}
        {name}
      </span>
    );
  };


  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: renderName, // 使用渲染函数
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button onClick={() => handleDownload(record)}>下载</Button>
          <Button onClick={() => showDeleteModal(record)}>删除</Button>
        </span>
      ),
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRows(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === '..',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <>
      <Space style={{marginBottom: 16,}}>
        <div>
          <Button onClick={() => setModalVisibleFile(true)}>新建文件</Button>
          <Modal
            title="请输入文件名称"
            visible={modalVisibleFile}
            onOk={createFile}
            onCancel={handleCancel}>
            <Input value={newFileName} onChange={(event) => setNewFileName(event.target.value)}/>
          </Modal>
        </div>
        <div>
          <Button onClick={() => setModalVisibleFolder(true)}>新建文件夹</Button>
          <Modal
            title="请输入文件夹名称"
            visible={modalVisibleFolder}
            onOk={createFolder}
            onCancel={handleCancel}>
            <Input
              value={newFolderName} onChange={(event) => setNewFolderName(event.target.value)}/>
          </Modal>
        </div>
        <div>
          <input type="file"  onChange={(e) => uploadFile(e.target.files[0])} />
        </div>
        <div>
          <input type="file" webkitdirectory="" onChange={(e) => uploadFolder(e.target)} />
        </div>
      </Space>
      <div>
        <p>{currentPath}</p>
      </div>
      <ProgressBar uppy={uppy} fixed hideAfterFinish/>
      <StatusBar uppy={uppy} hideUploadButton hideAfterFinish={false} showProgressDetails/>
      <div>
      <Button onClick={handleDelete} disabled={selectedRows.length === 0}>
        删除选中文件
      </Button>
      <Button onClick={handleDownloads} disabled={selectedRows.length === 0}>
        下载选中文件
      </Button>
      <Table
        columns={columns}
        dataSource={files}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        pagination={false}
      />
      <Modal
        title="确认删除"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        确定要删除选中的文件吗？
      </Modal>
    </div>
    </>
  );
};
export default FileManagePage;