import React, { useState, useEffect, useCallback } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { validate as uuidValidate } from 'uuid';
import API from '../utils/fetch';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import PostForm from '../components/PostForm';
import PostTable from '../components/PostTable';
import { FormValues } from '$/types';
import { PostEntity } from '@org/types'

const PostManagement: React.FC = () => {
  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [highlightCount, setHighlightCount] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState<React.Key[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<PostEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, pageSize]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.getPosts(currentPage, pageSize);
      setPosts(response.data);
      setHighlightCount(response.highlightCount);
      setTotalPosts(response.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error(
        'Failed to fetch posts: ' + (error.message || 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const handleEdit = useCallback((post: PostEntity) => {
    setEditingPost(post);
    setIsFormVisible(true);
  }, []);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (editingPost) {
        await API.updatePost(editingPost.id.toString(), values);
        message.success('Post updated successfully');
      } else {
        await API.createPost(values);
        message.success('Post created successfully');
      }

      setIsFormVisible(false);
      setEditingPost(null);
      await fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
      message.error(
        `Failed to ${editingPost ? 'update' : 'create'} post: ` +
          (error.message || 'Unknown error')
      );
    }
  };

  const handleDelete = async () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const validIds = selectedPosts.filter(
        (id) => typeof id === 'string' && uuidValidate(id)
      );

      if (validIds.length === 0) {
        message.error('No valid posts selected for deletion');
        return;
      }

      await Promise.all(validIds.map((id) => API.deletePost(id as string)));
      message.success('Selected posts deleted successfully');
      setSelectedPosts([]);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting posts:', error);
      message.error(
        'Failed to delete posts: ' +
          ((error as Error).message || 'Unknown error')
      );
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const rowSelection = {
    selectedRowKeys: selectedPosts,
    onChange: (selectedRowKeys: React.Key[]) =>
      setSelectedPosts(selectedRowKeys),
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Post Management</h1>

      <Button
        type="primary"
        icon={isFormVisible ? <MinusOutlined /> : <PlusOutlined />}
        onClick={() => {
          setIsFormVisible(!isFormVisible);
          if (!isFormVisible) {
            setEditingPost(null);
          }
        }}
        style={{ marginBottom: '16px' }}
      >
        {isFormVisible ? 'Hide Form' : 'Add Post'}
      </Button>

      {isFormVisible && (
        <PostForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingPost(null);
          }}
          initialValues={editingPost || undefined}
          highlightCount={highlightCount}
        />
      )}

      <div style={{ marginBottom: '16px', marginTop: '32px' }}>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          disabled={selectedPosts.length === 0}
          style={{ marginRight: '8px' }}
        >
          Delete Selected
        </Button>
      </div>

      <PostTable
        posts={posts}
        loading={loading}
        totalPosts={totalPosts}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
        onEdit={handleEdit}
        rowSelection={rowSelection}
      />

      <DeleteConfirmModal
        visible={isDeleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        selectedCount={selectedPosts.length}
      />
    </div>
  );
};

export default PostManagement;
