'use client'

import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { MoreHorizontal, Send } from 'lucide-react'
import { useDocument } from "../components/context/document-context"
import { Separator } from '../components/ui/separator'
import { Comment, Reply as ReplyType } from '../types/comment'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

export function CommentPanel() {
  const { 
    comments, 
    updateComment, 
    deleteComment,
    currentPage,
    setActiveToolbarItem,
    activeCommentId,
    setActiveCommentId,
    addComment,
    addReply,
    updateReply,
    deleteReply
  } = useDocument()

  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null)

  useEffect(() => {
    const comment = comments.find(c => c.id === activeCommentId);
    if (comment) {
      setCommentText(comment.content);
    } else {
      setCommentText('');
    }
  }, [activeCommentId, comments]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const commentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (commentDate.getTime() === today.getTime()) {
      return `Today ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSave = () => {
    if (commentText.trim()) {
      if (activeCommentId) {
        updateComment(activeCommentId, commentText);
      } else {
        addComment(currentPage, 50, 50);
        const newComment = comments.find(c => c.pageId === currentPage);
        if (newComment) {
          updateComment(newComment.id, commentText);
        }
      }
      setCommentText('');
    }
  };

  const handleDelete = (commentId: string) => {
    deleteComment(commentId)
  }

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      addReply(commentId, replyText);
      setReplyText('');
    }
  }

  const handleUpdateReply = (commentId: string, replyId: string) => {
    if (replyText.trim()) {
      updateReply(commentId, replyId, replyText);
      setReplyText('');
      setEditingReplyId(null);
    }
  }

  const handleDeleteReply = (commentId: string, replyId: string) => {
    deleteReply(commentId, replyId);
  }

  const pageComment = comments.find(comment => comment.pageId === currentPage);

  const CommentItem = ({ comment }: { comment: Comment }) => (
    <div className="space-y-2">
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(new Date(comment.createdAt))}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => setActiveCommentId(comment.id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm mt-2">{comment.content}</p>
        </div>
      </div>
    </div>
  );

  const ReplyItem = ({ reply, commentId }: { reply: ReplyType, commentId: string }) => (
    <div className="ml-4 mt-2 p-2 bg-gray-100 rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{reply.author}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(new Date(reply.createdAt))}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => {
                  setEditingReplyId(reply.id);
                  setReplyText(reply.content);
                }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeleteReply(commentId, reply.id)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm mt-2">{reply.content}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[280px] border-l bg-white flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Comment</h3>
        </div>

        {pageComment && pageComment.content && (
          <div className="space-y-4">
            <CommentItem comment={pageComment} />

            {pageComment.replies.map(reply => (
              <ReplyItem key={reply.id} reply={reply} commentId={pageComment.id} />
            ))}

            <div className="mt-4">
              <Input
                placeholder="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button 
                className="mt-2 w-full" 
                size="sm"
                onClick={() => handleAddReply(pageComment.id)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        )}

        {!pageComment || !pageComment.content ? (
          <>
            <Separator />
            <div className="space-y-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCommentText('');
                    setActiveCommentId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-auto p-4 border-t">
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={() => {
            setActiveToolbarItem(null);
            setActiveCommentId(null);
          }}
        >
          Finish Commenting
        </Button>
      </div>
    </div>
  )
}

