from otree.api import *
import pandas as pd
import random

doc = """
An app for calculation task
"""


class C(BaseConstants):
    NAME_IN_URL = 'task'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 2

    CAL_QNUM = 50
    CAL_MINUTES = 3
    CAL_SECONDS = 0

#caltest.csv is the question bank file.
caldf_all = pd.read_csv('task/caltest.csv')
caldf = caldf_all.loc[:] 
caldict = dict(zip(caldf['question'], caldf['answer']))


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    draw_dict = models.StringField() #randomly drawn questions
    cal_trials = models.IntegerField(initial=0) # number of input
    cal_correct = models.IntegerField(initial=0) # number of correct answers


# function for draw questions randomly
def draw_cal_questions(player:Player):
    draw_list = random.sample(list(caldict.keys()), C.CAL_QNUM)
    draw_dict = {k: caldict[k] for k in draw_list}
    return draw_dict 


# PAGES
class Pre_cal(Page):
    timeout_seconds = 5
    timer_text = 'Count Down:'
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        draw_dict= draw_cal_questions(player)
        player.draw_dict = str(draw_dict)


class Calculation(Page):
    form_model = 'player'
    form_fields = ['cal_trials','cal_correct']
    
    @staticmethod
    def vars_for_template(player: Player):
        draw_dict = eval(player.draw_dict)
        draw_dict_q = list(draw_dict.keys())
        
        if C.CAL_MINUTES < 10:
            first_cal_minutes = '0' + str(C.CAL_MINUTES)
        else:
            first_cal_minutes = str(C.CAL_MINUTES)
        if C.CAL_SECONDS == 0:
            first_cal_seconds = '00'
        else:
            first_cal_seconds = str(C.CAL_SECONDS)
        return dict(
            draw_dict_q1 = draw_dict_q[0:10],
            draw_dict_q2 = draw_dict_q[10:20],
            draw_dict_q3 = draw_dict_q[20:30],
            draw_dict_q4 = draw_dict_q[30:40],
            draw_dict_q5 = draw_dict_q[40:],
            first_cal_minutes = first_cal_minutes,
            first_cal_seconds = first_cal_seconds,
        )

    @staticmethod
    def js_vars(player: Player):
        draw_dict = eval(player.draw_dict)
        draw_dict_q = list(draw_dict.keys())
        draw_dict_a = list(draw_dict.values())

        return dict(
            draw_dict_q = draw_dict_q,
            draw_dict_a = draw_dict_a,
            cal_minutes = C.CAL_MINUTES,
            cal_seconds = C.CAL_SECONDS,
            round_number = player.round_number,
        )


class Results(Page):
    
    @staticmethod
    def vars_for_template(player: Player):
        return dict(
            cal_correct = player.cal_correct,
            cal_trials = player.cal_trials,
        )


page_sequence = [
    Pre_cal,
    Calculation,
    Results]
