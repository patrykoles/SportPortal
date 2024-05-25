import React, { useState, useEffect } from "react";
import { request, getAuthToken, setAuthToken } from "../axios-helper";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams, useHistory } from "react-router-dom";
import Comments from "./Comments";
import dateImage from "../img/date.svg";
import timeImage from "../img/time.svg";
import locationImage from "../img/location.svg";
import participantsImage from "../img/participants.svg";
import volleyImage from "../img/volleyball-op.svg";
import basketballImage from "../img/basketball-op.svg";
import footballImage from "../img/futbol-op.svg";
import hockeyImage from "../img/hockey-op.svg";
import runningImage from "../img/running-op.svg";
import tennisImage from "../img/tennis-op.svg";
import swimmingImage from "../img/swimming-op.svg";
import golfImage from "../img/golf-op.svg";
import bilardImage from "../img/bilard-op.svg";
import dartsImage from "../img/darts-op.svg";
import tabletennisImage from "../img/tabletennis-op.svg";
import danceImage from "../img/dance-op.svg";
import rugbyImage from "../img/rugby-op.svg";

export default function ListPosts({ filters }) {
  const navigate = useNavigate();
  const [sub, setSub] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const { id } = useParams();

  const [flag, setFlag] = useState(false);

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const authToken = getAuthToken();
    if (authToken && authToken !== "null") {
      const decoded = jwtDecode(authToken);
      if (decoded.hasOwnProperty("sub")) {
        setSub(decoded.sub);
      }
    }
  }, []);

  useEffect(() => {
    let url;
    if (filters.specialFilter == "user") {
      url = "/userposts";
    } else if (filters.specialFilter == "joined") {
      url = "/joinedposts";
    } else {
      const isEmpty = Object.values(filters).every((value) => !value);
      url = isEmpty ? "/allposts" : "/filteredposts";

      if (!isEmpty) {
        url += `?sport=${filters.sport}&startDate=${filters.startDate}&endDate=${filters.endDate}&startTime=${filters.startTime}&endTime=${filters.endTime}`;
      }
    }

    // Wysyłanie zapytania
    request("GET", url, {})
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
  }, [filters, flag]);

  const handleEdit = (id) => {
    navigate(`/editpost/${id}`);
  };
  const handleAuthorClick = (id) => {
    navigate(`/publicprofile/${id}`);
  };

  const handleDelete = (id) => {
    request("DELETE", `/delpost/${id}`, {})
      .then((response) => {
        setFlag(!flag);
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
  };

  const handleJoin = (id) => {
    request("PUT", `/joinpost/${id}`, {})
      .then((response) => {
        setFlag(!flag);
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
  };

  const handleLeave = (id) => {
    request("PUT", `/leavepost/${id}`, {})
      .then((response) => {
        setFlag(!flag);
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
  };

  const handleShowComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const handleAddComment = (postId) => {
    setCommentContent("");
    setShowCommentInput(postId);
  };

  const handleSubmitComment = (postId) => {
    const content = commentContent.trim();
    if (content === "") {
      alert("Treść komentarza nie może być pusta!");
      return;
    }
    if(content.length > 500){
      alert("Komentarz nie może mieć więcej niż 500 znaków!");
      return;
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().split(" ")[0];

    request("POST", `/sendcomment/${postId}`, {
      date: formattedDate,
      time: formattedTime,
      content: content,
    })
      .then((response) => {
        // Tutaj możesz zaktualizować stan danych, aby odświeżyć komentarze po dodaniu nowego komentarza
        setFlag(!flag);
        setShowCommentInput(false);
        setShowComments({});
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
  };

  const handleCancelComment = () => {
    setShowCommentInput(false);
  };

  const handleTextAreaChange = (event) => {
    setCommentContent(event.target.value);
  };

  const getBackgroundColor = (sport) => {
    switch (sport) {
      case "football":
        return "#8da750"; // Przykładowy kolor tła dla piłki nożnej
      case "basketball":
        return "#ff8d21"; // Przykładowy kolor tła dla koszykówki
      case "tennis":
        return "#FFD8BE"; // Przykładowy kolor tła dla tenisa
      case "volleyball":
        return "#d4d4d4";
      case "running":
        return "#f5d2e6";
      case "hockey":
        return "#9CFFFA";
      case "swimming":
        return "#1bc2f5";
      case "golf":
        return "#06bf5f";
      case "bilard":
        return "#649c6f";
      case "darts":
        return "#C0C0C0";
      case "tabletennis":
        return "#6f84fc";
      case "dance":
        return "#f5edb5";
      case "rugby":
        return "#fa2a69";
      default:
        return "#ded7d7"; // Domyślny kolor tła
    }
  };

  const getBackgroundImage = (sport) => {
    switch (sport) {
      case "football":
        return `url(${footballImage})`; // Ścieżka do obrazka dla piłki nożnej
      case "basketball":
        return `url(${basketballImage})`; // Ścieżka do obrazka dla koszykówki
      case "tennis":
        return `url(${tennisImage})`; // Ścieżka do obrazka dla tenisa
      case "volleyball":
        return `url(${volleyImage})`; // Ścieżka do obrazka dla siatkówki
      case "running":
        return `url(${runningImage})`; // Ścieżka do obrazka dla biegania
      case "hockey":
        return `url(${hockeyImage})`;
      case "swimming":
        return `url(${swimmingImage})`;
      case "golf":
        return `url(${golfImage})`;
      case "bilard":
        return `url(${bilardImage})`;
      case "darts":
        return `url(${dartsImage})`;
      case "tabletennis":
        return `url(${tabletennisImage})`;
      case "dance":
        return `url(${danceImage})`;
      case "rugby":
        return `url(${rugbyImage})`;
      default:
        return "none"; // Brak tła
    }
  };

  const mapSportName = (sport) => {
    switch (sport) {
      case 'football':
        return 'Piłka nożna';
      case 'basketball':
        return 'Koszykówka';
      case 'volleyball':
        return 'Siatkówka';
      case 'tennis':
        return 'Tenis';
      case 'running':
        return 'Bieganie';
      case 'hockey':
        return 'Hokej';
      case 'swimming':
        return 'Pływanie';
      case 'golf':
        return 'Golf';
      case 'bilard':
        return 'Bilard';
      case 'darts':
        return 'Darty';
      case 'tabletennis':
        return 'Tenis stołowy';
      case 'dance':
        return 'Taniec';
      case 'rugby':
        return 'Rugby';
      default:
        return sport;
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "50%",
        }}
      >
        {data.length === 0 && <p>Brak postów do wyświetlenia.</p>}
        {data.map((post, index) => (
          <div
            key={index}
            className="container m-5 border p-3"
            style={{
              borderColor: "#f2f2f2",
              boxShadow: "0px 0px 60px rgba(0, 0, 0, 0.3)",
              backgroundColor: getBackgroundColor(post.sport),
              backgroundImage: getBackgroundImage(post.sport),
              backgroundRepeat: "no-repeat",

            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                {post.userId == sub ? (
                  <>
                    <h5 className="mb-0">{post.userLogin}</h5>
                  </>
                ) : (
                  <>
                    <a
                      href="#"
                      onClick={() => handleAuthorClick(post.userId)}
                      style={{ fontSize: "1.2rem", textDecoration: "none" }}
                    >
                      {post.userLogin}
                    </a>
                  </>
                )}
                <p className="mb-0">{mapSportName(post.sport)}</p>
              </div>
              <div>
                {post.userId == sub && (
                  <>
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => handleEdit(post.id)}
                    >
                      Edytuj
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleDelete(post.id)}
                    >
                      Usuń
                    </button>
                  </>
                )}
              </div>
            </div>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              {post.title}
            </h2>
            <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
              {post.description}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "50%" }}>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={dateImage}
                    alt="Data"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  <p>{new Date(post.date).toLocaleDateString()}</p>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={timeImage}
                    alt="Czas"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  <p>{post.time}</p>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={locationImage}
                    alt="Miejsce"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  <p>{post.location}</p>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={participantsImage}
                    alt="Liczba uczestników"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  <p>{post.noParticipants}</p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                {post.userId != sub && (
                  <>
                    {post.isJoined == "false" && (
                      <>
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => handleJoin(post.id)}
                        >
                          Dołącz do wydarzenia
                        </button>
                      </>
                    )}
                    {post.isJoined == "true" && (
                      <>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleLeave(post.id)}
                        >
                          Opuść wydarzenie
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddComment(post.id)}
                >
                  Dodaj komentarz
                </button>
                <button
                  className="btn btn-info ml-2"
                  onClick={() => handleShowComments(post.id)}
                >
                  {showComments[post.id]
                    ? "Ukryj komentarze"
                    : "Pokaż komentarze"}
                </button>
              </div>
            </div>
            {showCommentInput === post.id && (
              <div className="mb-3">
                <textarea
                  value={commentContent}
                  onChange={handleTextAreaChange}
                  rows="4"
                  cols="50"
                  placeholder="Wprowadź treść komentarza"
                  style={{ width: '50%', resize: 'none', marginTop: '10px' }}
                ></textarea>
                <div>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSubmitComment(post.id)}
                  >
                    Zatwierdź
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={handleCancelComment}
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}
            {showComments[post.id] && <Comments postId={post.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
