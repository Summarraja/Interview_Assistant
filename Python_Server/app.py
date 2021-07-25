from flask import Flask, jsonify;
from flask_socketio import SocketIO, emit, send

import os
import pickle
import uuid
import soundfile
import numpy as np
import librosa
import base64

import argparse
import matplotlib.pyplot as plt
import cv2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D
from tensorflow.keras.layers import MaxPooling2D

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['CORS_HEADERS'] = 'Content-Type'
socketio = SocketIO(app, cors_allowed_origins="*")
AudioModel = pickle.load(open("models/mlp_classifier2.model", "rb"))

# app.debug=True
app.host='localhost'


model = Sequential()

model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48,48,1)))
model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
#fully connected neural network
model.add(Flatten())
model.add(Dense(1024, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(7, activation='softmax'))

model.load_weights('models/model.h5')

emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}


def data_uri_to_cv2_img(uri):
    encoded_data = uri.split(',')[1]
    # nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


def extract_feature(file_name, **kwargs):
    """
    Extract feature from audio file `file_name`
        Features supported:
            - MFCC (mfcc)
            - Chroma (chroma)
            - MEL Spectrogram Frequency (mel)
            - Contrast (contrast)
            - Tonnetz (tonnetz)
        e.g:
        `features = extract_feature(path, mel=True, mfcc=True)`
    """
    mfcc = kwargs.get("mfcc")
    chroma = kwargs.get("chroma")
    mel = kwargs.get("mel")
    contrast = kwargs.get("contrast")
    tonnetz = kwargs.get("tonnetz")
    with soundfile.SoundFile(file_name) as sound_file:
        # X = sound_file.read(dtype="float32")
        # sample_rate = sound_file.samplerate
        
        X, sample_rate = librosa.load(file_name)

        # print(len(intervals))
        # print(intervals[0][0]==0)
        if chroma or contrast:
            stft = np.abs(librosa.stft(X))
        result = np.array([])
        if mfcc:
            mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
            result = np.hstack((result, mfccs))
        if chroma:
            chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T,axis=0)
            result = np.hstack((result, chroma))
        if mel:
            mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T,axis=0)
            result = np.hstack((result, mel))
        if contrast:
            contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T,axis=0)
            result = np.hstack((result, contrast))
        if tonnetz:
            tonnetz = np.mean(librosa.feature.tonnetz(y=librosa.effects.harmonic(X), sr=sample_rate).T,axis=0)
            result = np.hstack((result, tonnetz))
    return result



@socketio.on('voice-emotions')
def extract_emotion(blob):
    unique_filename = str(uuid.uuid4())+".wav"
    with open(unique_filename, mode='bx') as f:
        f.write(blob)
    # # extract features and reshape it
    X, sample_rate = librosa.load(unique_filename)
    intervals = librosa.effects.split(X, top_db=20)
    if len(intervals)==1 and intervals[0][0]==0:
        emit('voice-emotions',{'emotion':'silent'})
        print("Silent")
    else:
        print("Not Silent")
        features = extract_feature(unique_filename, mfcc=True, chroma=True, mel=True).reshape(1, -1)
    # predict
        result = AudioModel.predict(features)
    # show the result !
        print("result:", result)
    # send("Audio Emotion Detected: "+result[0])        
        emit('voice-emotions',{'emotion':result[0]})

    test = os.listdir(os.curdir)

    for item in test:
        if item.endswith(".wav"):
            os.remove(os.path.join(os.curdir, item))
    return None

@socketio.on('connect')
def test_connect():
    # emit('my response', {'data': 'Connected'})
    print("Client connected",)

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('image-emotions')
def image_emotions(arg1):
    print("image received")
    img = data_uri_to_cv2_img(arg1)
    facecasc = cv2.CascadeClassifier('models/haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = facecasc.detectMultiScale(gray,scaleFactor=1.3, minNeighbors=5)
    # cv2.imshow("",img)
    # cv2.waitKey(0)
    # cv2.waitKey(1000)
    # cv2.destroyAllWindows()
    if(faces==()):
        emit('image-emotions',{'emotion':-1})
        print([0,0,0,0,0,0,0])

    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h, x:x + w]
        cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0)
        prediction = model.predict(cropped_img)
        # print(prediction[0])
        maxindex = int(np.argmax(prediction))
        # print(maxindex)
        # print(prediction[0])
        print(emotion_dict[maxindex])
        # print(maxindex)
        emit('image-emotions',{'emotion':maxindex})

if __name__ == '__main__':
    socketio.run(app, host='localhost', port=5001)
