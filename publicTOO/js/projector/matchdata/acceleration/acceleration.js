auth.onAuthStateChanged(user => {
    if (!user) {
        return;
    }

    const matchDoc = firestoreDB.collection("match").doc(auth.currentUser.uid);
    matchDoc.onSnapshot(snapshot => {
        if (!snapshot.exists) {
            return;
        }

        const matchId = snapshot.data().match;
        const dbRefs = {
            question: realtimeDB.ref(`${matchId}/Acceleration/QS`),
            displayAnswer: realtimeDB.ref(`${matchId}/AccelerationDisplayAnswerImage`),
            status: realtimeDB.ref(`${matchId}/phanthistatus/tangtoc`),
            answers: realtimeDB.ref(`${matchId}/AccelerationAnswers`),
            openAnswer: realtimeDB.ref(`${matchId}/AccelerationOpenAnswer`),
            checked: realtimeDB.ref(`${matchId}/AccelerationChecked`),
            alreadyOpen: realtimeDB.ref(`${matchId}/AlreadyOpenAnswer`)
        };

        dbRefs.question.on("value", snapshot => {
            const questionNum = snapshot.val().tangtoc;
            const questionRef = realtimeDB.ref(`${matchId}/AccelerationQuestion/QS${questionNum}`);
            
            questionRef.on("value", qSnapshot => {
                document.getElementById('AccelerationQuestion').textContent = 
                    questionNum === 0 ? '' : qSnapshot.val().cauhoi;
            });

            const answersElement = document.getElementById("AccelerationAnswers");
            for (let i = 1; i <= 4; i++) {
                answersElement.children[i - 1].classList.remove("brightness-50");
            }

            const mediaElement = document.getElementById("AccelerationMedia");
            mediaElement.pause();
            mediaElement.currentTime = 0;

            toggleMainUI(questionNum !== 0);

            if (questionNum !== 0) {
                document.getElementById("audio_AccelerationQuestionShow").currentTime = 0;
                document.getElementById('audio_AccelerationQuestionShow').play();
            }

            resetSlider();
        });

        dbRefs.question.on("value", snapshot => {
            const questionNum = snapshot.val().tangtoc;
            resetAnswerUI();
            dbRefs.displayAnswer.off("value");
            dbRefs.displayAnswer.on("value", displaySnapshot => {
                const status = displaySnapshot.val().status;
                const mediaPath = `${matchId}/tt/${status ? "datt" : 'tt'}${questionNum}/tt${questionNum}`;
                firebase.storage().ref(`${mediaPath}.jpg`).getDownloadURL().then(url => {
                    document.getElementById("AccelerationMedia").poster = url;
                }).catch(() => {
                    document.getElementById('AccelerationMedia').poster = '';
                });

                if (!status) {
                    firebase.storage().ref(`${mediaPath}.mp4`).getDownloadURL().then(url => {
                        document.getElementById("AccelerationMedia").src = url;
                    }).catch(() => {
                        document.getElementById("AccelerationMedia").src = '';
                    });
                } else {
                    document.getElementById("AccelerationMedia").src = '';
                }
            });
        });

        function toggleMainUI(show) {
            const mainUI = document.getElementById("AccelerationMainUI");
            if (show) {
                mainUI.classList.add('hidden');
                setTimeout(() => {
                    mainUI.classList.remove('hidden');
                });
            } else {
                mainUI.classList.add("hidden");
            }
        }

        let startTime;
        dbRefs.status.on("value", snapshot => {
            const start = snapshot.val().batdau;
            if (start === 1) {
                dbRefs.question.once("value").then(qSnapshot => {
                    const questionNum = qSnapshot.val().tangtoc;
                    let duration;
                    if (questionNum === 1) {
                        duration = 10;
                        startSlider(10000);
                    } else if (questionNum === 2) {
                        duration = 20;
                        startSlider(20000);
                    } else if (questionNum === 3) {
                        duration = 30;
                        startSlider(30000);
                    } else if (questionNum === 4) {
                        duration = 40;
                        startSlider(40000);
                    }

                    const audioId = `audio_Acceleration${duration}Seconds`;
                    document.getElementById(audioId).currentTime = 0;
                    document.getElementById(audioId).play();
                    document.getElementById("AccelerationMedia").play();
                    startTime = Date.now();
                    const interval = setInterval(() => {
                        duration -= 1;
                        if (duration <= 0) {
                            clearInterval(interval);
                        }
                    }, 1000);
                });
            }
        });

        function startSlider(duration) {
            resetSlider();
            const slider = document.getElementById('AccelerationSlider');
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                slider.value = progress * 100;
                if (progress >= 1) {
                    clearInterval(interval);
                }
            }, 16);
        }

        function resetSlider() {
            const slider = document.getElementById('AccelerationSlider');
            slider.value = 0;
        }

        dbRefs.answers.on("value", snapshot => {
            (async function () {
                const answers = {};
                snapshot.forEach(childSnapshot => {
                    const answerData = childSnapshot.val();
                    const timestamp = parseFloat(answerData.answerTimestamp);
                    const playerId = answerData.id;
                    if (!answers[playerId] || timestamp > parseFloat(answers[playerId].answerTimestamp)) {
                        answers[playerId] = {
                            'answer': answerData.answer,
                            'answerTimestamp': answerData.answerTimestamp
                        };
                    }
                });

                const players = [];
                const promises = [];
                for (let i = 1; i <= 4; i++) {
                    promises.push(realtimeDB.ref(`${matchId}/games/player${i}/displayName`).once("value").then(playerSnapshot => {
                        const displayName = playerSnapshot.val() || `Player ${i}`;
                        const answerData = answers[i] || null;
                        players.push({
                            'id': i,
                            'displayName': displayName,
                            'answer': answerData ? answerData.answer : '',
                            'answerTimestamp': answerData ? answerData.answerTimestamp : null
                        });
                    }));
                }
                await Promise.all(promises);

                const unansweredPlayers = players.filter(player => !player.answerTimestamp).sort((a, b) => a.id - b.id);
                const answeredPlayers = players.filter(player => player.answerTimestamp).sort((a, b) => parseFloat(a.answerTimestamp) - parseFloat(b.answerTimestamp));
                const sortedPlayers = unansweredPlayers.concat(answeredPlayers);

                sortedPlayers.forEach((player, index) => {
                    const nameElement = document.getElementById(`AccelerationAnswerPlayerName${index + 1}`);
                    const answerElement = document.getElementById(`AccelerationAnswerPlayer${index + 1}`);
                    const timestampElement = document.getElementById(`AccelerationAnswerTimestampPlayer${index + 1}`);
                    if (nameElement) {
                        nameElement.textContent = player.displayName;
                    }
                    if (answerElement) {
                        answerElement.textContent = player.answer.toUpperCase();
                    }
                    if (timestampElement) {
                        timestampElement.textContent = player.answerTimestamp ? `${player.answerTimestamp}s` : '';
                    }
                });
            })();
        });

        let originalClasses = new WeakMap();
        function resetAnswerUI() {
            // const answerUI = document.getElementById("AccelerationAnswerUI");
            // if (!answerUI) {
            //     return;
            // }
            // answerUI.querySelectorAll('*').forEach(element => {
            //     originalClasses.set(element, [...element.classList]);
            //     element.classList.remove("leftName", "leftAnswer", "verticalLineAppear");
            // });
        }

        function restoreAnswerUI() {
            const answerUI = document.getElementById("AccelerationAnswerUI");
            if (!answerUI) {
                return;
            }
            answerUI.querySelectorAll('*').forEach(element => {
                if (originalClasses.has(element)) {
                    element.classList.add(...originalClasses.get(element));
                }
            });
            originalClasses = new WeakMap();
        }

        let isAnswerOpen = true;
        dbRefs.openAnswer.on('value', snapshot => {
            const openAnswer = snapshot.val().OpenAnswer;
            if (openAnswer === 1) {
                isAnswerOpen = false;
                dbRefs.alreadyOpen.once("value").then(alreadyOpenSnapshot => {
                    if (alreadyOpenSnapshot.val().status === true) {
                        resetAnswerUI();
                        return;
                    }
                    document.getElementById("audio_AccelerationAnswerShow").currentTime = 0;
                    document.getElementById("audio_AccelerationAnswerShow").play();
                });
                document.getElementById("AccelerationMainUI").classList.add("hidden");
                document.getElementById("AccelerationAnswerUI").classList.remove("hidden");
            } else if (openAnswer === 0 && isAnswerOpen == false) {
                document.getElementById('AccelerationMainUI').classList.remove("hidden");
                document.getElementById("AccelerationAnswerUI").classList.add("hidden");
            }
        });

        dbRefs.checked.on("value", snapshot => {
            const checkAnswer = snapshot.val().checkAnswer;
            if (checkAnswer === true) {
                const answerData = snapshot.val();
                let isCorrect = false;
                let wrongCount = 0;
                const answersElement = document.getElementById("AccelerationAnswers");
                for (let i = 1; i <= 4; i++) {
                    const correctOrWrong = answerData[`TT${i}`].correctorwrong;
                    answersElement.children[i - 1].classList.remove("brightness-50");
                    if (correctOrWrong === 1) {
                        isCorrect = true;
                    } else {
                        answersElement.children[i - 1].classList.add('brightness-50');
                        wrongCount++;
                    }
                }
                if (isCorrect) {
                    document.getElementById("audio_AccelerationRightAnswer").currentTime = 0;
                    document.getElementById("audio_AccelerationRightAnswer").play();
                } else if (wrongCount === 4) {
                    document.getElementById("audio_AccelerationWrongAnswer").currentTime = 0;
                    document.getElementById("audio_AccelerationWrongAnswer").play();
                }
            }
        });
    });
});