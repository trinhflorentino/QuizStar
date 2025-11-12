auth.onAuthStateChanged(user => {
    if (!user) return;
    
    const matchDoc = firestoreDB.collection("match").doc(auth.currentUser.uid);
    matchDoc.onSnapshot(snapshot => {
        if (!snapshot.exists) return;
        
        const matchId = snapshot.data().match;
        let countdownInterval;
        
        const playerStatusRef = realtimeDB.ref(`${matchId}/playerstatus/khoidong`);
        const phaseStatusRef = realtimeDB.ref(`${matchId}/phanthistatus/khoidong`);
        const answerStatusRef = realtimeDB.ref(`${matchId}/khoidongdungsai`);
        const soundsRef = realtimeDB.ref(`${matchId}/Sounds`);
        
        const audioElements = {
            phase1: document.getElementById("audio_StartingTimes_Phase1"),
            phase2: document.getElementById('audio_StartingTimes_Phase2'),
            phase3: document.getElementById("audio_StartingTimes_Phase3"),
            finish: document.getElementById("audio_StartingFinish")
        };
        
        let selectedVoice = null;
        function loadVoices() {
            const voices = speechSynthesis.getVoices();
            selectedVoice = voices.find(voice => voice.lang === "en-US" && (voice.name.includes('Female') || voice.name.includes("feminine") || voice.name.includes("girl"))) || voices.find(voice => voice.lang === "en-US") || voices[0];
        }
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        loadVoices();
        
        function speakText(text) {
            if (!text) return;
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            speechSynthesis.speak(utterance);
        }
        
        phaseStatusRef.on("value", snapshot => {
            const phaseStatus = snapshot.val()?.["batdau"];
            if (phaseStatus === 1) {
                const startQuestionShowAudio = document.getElementById('audio_StartQuestionShow');
                const startStartQuestionShowAudio = document.getElementById("audio_StartStartQuestionShow");
                startQuestionShowAudio.currentTime = 0;
                startQuestionShowAudio?.play();
                setTimeout(() => {
                    startStartQuestionShowAudio.currentTime = 0;
                    startStartQuestionShowAudio?.play();
                    document.getElementById("StartI").classList.remove("hidden");
                }, 3600);
                Object.values(audioElements).forEach(audio => {
                    if (audio) {
                        audio.currentTime = 0;
                    }
                });
            }
        });
        
        answerStatusRef.on('value', snapshot => {
            const rightAnswerAudio = document.getElementById("audio_StartingRightAnswer");
            const wrongAnswerAudio = document.getElementById('audio_StartingWrongAnswer');
            if (snapshot.val().dung === 1) {
                rightAnswerAudio.currentTime = 0;
                rightAnswerAudio.play();
            }
            if (snapshot.val().sai === 1) {
                wrongAnswerAudio.currentTime = 0;
                wrongAnswerAudio.play();
            }
        });
        
        function updatePlayerContainerStyles(playerContainer, selectedPlayerIndex) {
            if (!playerContainer) return;

            if (selectedPlayerIndex === -1) {
                Array.from(playerContainer.children).forEach(player => {
                    player.classList.add("bg-no-repeat", "bg-cover");
                    player.style.backgroundImage = "url('/img/Olympia_22_KĐ_contestantbar.svg')";
                });
            } else if (selectedPlayerIndex >= 0 && selectedPlayerIndex < playerContainer.children.length) {
                Array.from(playerContainer.children).forEach((player, index) => {
                    player.classList.remove("text-defaultColor", "bg-white");
                    player.classList.add("text-white", "bg-no-repeat", "bg-cover");
                    player.style.backgroundImage = index === selectedPlayerIndex 
                        ? "url('/img/Olympia_22_KĐ_contestantbar_buzzer.svg')"
                        : "url('/img/Olympia_22_KĐ_contestantbar.svg')";
                });
            }
        }

        playerStatusRef.on('value', snapshot => {
            const playerStatus = snapshot.val();
            if (playerStatus?.player !== undefined) {
                const currentPlayer = playerStatus.player;
                ["currentStartIQuestionNumberRef", 'currentStartIQuestionRef', "currentStartIAnswerRef"].forEach(ref => {
                    if (window[ref]) {
                        window[ref].off();
                    }
                });
                const questionNumberRef = realtimeDB.ref(`${matchId}/khoidong`);
                window.currentStartIQuestionNumberRef = questionNumberRef;
                questionNumberRef.on("value", snapshot => {
                    const questionNumber = snapshot.val()?.["causo"];
                    const questionRef = realtimeDB.ref(`${matchId}/StartQuestion/Q${currentPlayer}DB/cau${questionNumber}`);
                    const answerRef = realtimeDB.ref(`${matchId}/StartQuestion/Q${currentPlayer}DB/dacau${questionNumber}`);
                    window.currentStartIQuestionRef = questionRef;
                    window.currentStartIAnswerRef = answerRef;
                    clearInterval(countdownInterval);
                    document.getElementById("StartICountdown").textContent = '';
                    const questionNumberElement = document.getElementById("StartIQuestionNumber");
                    if (questionNumber === 0) {
                        questionNumberElement.textContent = "Câu 0/6";
                    } else if (questionNumber === 7) {
                        questionNumberElement.textContent = "Đã hoàn thành";
                    } else {
                        questionNumberElement.textContent = `Câu ${questionNumber}/6`;
                    }
                    const playerContainer = document.getElementById("startPlayerContainer");
                    updatePlayerContainerStyles(playerContainer, parseInt(currentPlayer, 10) - 1);
                    questionRef.on('value', snapshot => {
                        const questionText = snapshot.val();
                        document.getElementById("StartIQuestion").textContent = questionText;
                        soundsRef.on("value", snapshot => {
                            const sounds = snapshot.val();
                            if (sounds?.["EnglishVoice"] && questionText) {
                                speakText(questionText);
                            }
                        });
                    });
                    Object.values(audioElements).forEach(audio => audio?.pause() && (audio.currentTime = 0));
                    if (questionNumber > 0 && questionNumber < 4) {
                        audioElements.phase1?.play();
                    }
                    if (questionNumber > 3 && questionNumber < 6) {
                        audioElements.phase2?.play();
                    }
                    if (questionNumber === 6) {
                        audioElements.phase3?.play();
                    }
                    if (questionNumber === 7) {
                        setTimeout(() => {
                            audioElements.finish?.play();
                            document.getElementById("StartI").classList.add("hidden");
                        }, 2000);
                    }
                });
            }
        });
        
        const countdownRef = realtimeDB.ref(`${matchId}/StartCountdown`);
        countdownRef.on("value", snapshot => {
            const countdown = snapshot.val()?.["countdown"];
            if (countdown === 1) {
                let countdownValue = 5;
                document.getElementById("StartICountdown").textContent = '' + countdownValue;
                countdownInterval = setInterval(() => {
                    countdownValue--;
                    document.getElementById("StartICountdown").textContent = '' + countdownValue;
                    if (countdownValue <= 0) {
                        clearInterval(countdownInterval);
                        document.getElementById('StartICountdown').textContent = '';
                    }
                }, 1000);
            }
        });
    });
});