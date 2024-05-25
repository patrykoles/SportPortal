import React, { useState, useEffect } from "react";
import { request, getAuthToken, setAuthToken } from "../axios-helper";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams, useHistory } from "react-router-dom";

export default function Comments({ postId }) {
  const navigate = useNavigate();
  const [sub, setSub] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [flag, setFlag] = useState(false);

  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    const authToken = getAuthToken();
        if (authToken && authToken !== "null") {
            const decoded = jwtDecode(authToken);
            if (decoded.hasOwnProperty("sub")) {
                setSub(decoded.sub);                
            }
        }
  }, [])

  useEffect(() => {
    request("GET", `/getcomments/${postId}`,{})
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setAuthToken(null);
          navigate(
            `/login?message=${encodeURIComponent(
              "Sesja wygasła. Zaloguj się ponownie."
            )}`
          );
        } else {
          console.error("Wystąpił błąd:", error);
          setError(error);
        }
      });
  }, [flag])

  
  const handleAuthorClick = (id) => {
    navigate(`/publicprofile/${id}`);
  }

  const handleDelete = (id) => {
    request(
        "DELETE",
        `/delcomment/${id}`,
        {}
    ).then((response) => {
        setFlag(!flag);
    }).catch(error => {
        if (error.response.status === 401) {
            setAuthToken(null);
            navigate(
              `/login?message=${encodeURIComponent(
                "Sesja wygasła. Zaloguj się ponownie."
              )}`
            );
          } else {
            console.error("Wystąpił błąd:", error);
            setError(error);
          }
    });
  }

  const handleEdit = (id) => {
    setEditCommentId(id);
    const commentToEdit = data.find(comment => comment.id === id);
    setEditedComment(commentToEdit.content);
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditedComment("");
  };

  const handleSubmitEdit = (id) => {
    const content = editedComment.trim();
    if (content === "") {
      alert("Treść komentarza nie może być pusta!");
      return;
    }
    if(content.length > 500){
      alert("Komentarz nie może mieć więcej niż 500 znaków!");
      return;
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = currentDate.toTimeString().split(' ')[0];
  
    request(
      "PUT",
      `/changecomment/${id}`,
      {
        date: formattedDate,
        time: formattedTime,
        content: content       
      }
    ).then((response) => {
      setFlag(!flag);
      setEditCommentId(null);
      setEditedComment("");
    }).catch(error => {
      if (error.response.status === 401) {
        setAuthToken(null);
        navigate(
          `/login?message=${encodeURIComponent(
            "Sesja wygasła. Zaloguj się ponownie."
          )}`
        );
      } else {
        console.error("Wystąpił błąd:", error);
        setError(error);
      }
    });
  };

  const handleTextAreaChange = (event) => {
    setEditedComment(event.target.value);
  };

 
  return (
    <div>
      {data.length === 0 && <p>Brak komentarzy.</p>}
      {data.map((comment) => (
        <div key={comment.id} style={{ marginBottom: '20px', padding: '10px', borderTop: '1px solid #ccc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {comment.userId == sub ? (
                <strong>{comment.userLogin}</strong>
              ) : (
                <a
                  href="#"
                  onClick={() => handleAuthorClick(comment.userId)}
                  style={{ fontSize: '1.2rem', textDecoration: 'none' }}
                >
                  {comment.userLogin}
                </a>
              )}
              <div style={{ fontSize: '0.8rem', color: '#555' }}>
                {new Date(comment.date).toLocaleDateString()}, {comment.time}
              </div>
            </div>
            {comment.userId == sub && (
              <div>
                <button 
                  onClick={() => handleEdit(comment.id)} 
                  style={{ marginRight: '5px', backgroundColor: '#eee', border: '1px solid #ccc', padding: '5px' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#ddd'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#eee'; }}
                >
                  Edytuj
                </button>
                <button 
                  onClick={() => handleDelete(comment.id)} 
                  style={{ backgroundColor: '#eee', border: '1px solid #ccc', padding: '5px' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#ddd'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#eee'; }}
                >
                  Usuń
                </button>
              </div>
            )}
          </div>
          {editCommentId === comment.id ? (
            <>
              <textarea 
                value={editedComment} 
                onChange={handleTextAreaChange} 
                rows="4" 
                cols="50"
                placeholder="Wprowadź treść komentarza"
                style={{ width: '60%', resize: 'none', marginTop: '10px' }}
              ></textarea>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => handleSubmitEdit(comment.id)} 
                  style={{ marginRight: '5px', backgroundColor: '#eee', border: '1px solid #ccc', padding: '5px' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#ddd'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#eee'; }}
                >
                  Zatwierdź
                </button>
                <button 
                  onClick={handleCancelEdit} 
                  style={{ backgroundColor: '#eee', border: '1px solid #ccc', padding: '5px' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#ddd'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#eee'; }}
                >
                  Anuluj
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ marginTop: '10px' }}>{comment.content}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
