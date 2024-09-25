from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Union
from uuid import UUID

from pydantic import BaseModel


class Component(Enum):
    COMBO_PIECE = "combo_piece"
    MELD_PART = "meld_part"
    MELD_RESULT = "meld_result"
    TOKEN = "token"


class AllPartObject(Enum):
    RELATED_CARD = "related_card"


class AllPart(BaseModel):
    object: AllPartObject
    id: UUID
    component: Component
    name: str
    type_line: str
    uri: str


class BorderColor(Enum):
    BLACK = "black"
    BORDERLESS = "borderless"
    GOLD = "gold"
    SILVER = "silver"
    WHITE = "white"


class ColorIdentity(Enum):
    B = "B"
    C = "C"
    G = "G"
    R = "R"
    T = "T"
    U = "U"
    W = "W"


class ImageUris(BaseModel):
    small: str
    normal: str
    large: str
    png: str
    art_crop: str
    border_crop: str


class CardFaceObject(Enum):
    CARD_FACE = "card_face"


class HandModifierEnum(Enum):
    EMPTY = "*"
    FLUFFY = "*²"
    HAND_MODIFIER = "∞"
    HAND_MODIFIER_0 = "-0"
    HAND_MODIFIER_1 = "+1"
    HAND_MODIFIER_2 = "2+*"
    PURPLE = "?"
    PURPLE_1 = "*+1"
    THE_0 = "+0"
    THE_1 = "1+*"
    THE_15 = "1.5"
    THE_2 = "+2"
    THE_25 = "2.5"
    THE_3 = "+3"
    THE_35 = "3.5"
    THE_4 = "+4"
    THE_5 = ".5"
    THE_7 = "7-*"


class CardFace(BaseModel):
    object: CardFaceObject
    name: str
    mana_cost: str
    oracle_text: str
    type_line: Optional[str] = None
    colors: Optional[List[ColorIdentity]] = None
    artist: Optional[str] = None
    artist_id: Optional[UUID] = None
    illustration_id: Optional[UUID] = None
    image_uris: Optional[ImageUris] = None
    power: Optional[Union[HandModifierEnum, int]] = None
    toughness: Optional[Union[HandModifierEnum, int]] = None
    flavor_text: Optional[str] = None
    color_indicator: Optional[List[ColorIdentity]] = None
    watermark: Optional[str] = None
    loyalty: Optional[int] = None
    defense: Optional[int] = None


class Finish(Enum):
    ETCHED = "etched"
    FOIL = "foil"
    NONFOIL = "nonfoil"


class FrameEnum(Enum):
    FUTURE = "future"


class FrameEffect(Enum):
    COLORSHIFTED = "colorshifted"
    COMPANION = "companion"
    COMPASSLANDDFC = "compasslanddfc"
    CONVERTDFC = "convertdfc"
    DEVOID = "devoid"
    DRAFT = "draft"
    EXTENDEDART = "extendedart"
    FANDFC = "fandfc"
    FULLART = "fullart"
    INVERTED = "inverted"
    LEGENDARY = "legendary"
    LESSON = "lesson"
    MIRACLE = "miracle"
    MOONELDRAZIDFC = "mooneldrazidfc"
    NYXTOUCHED = "nyxtouched"
    ORIGINPWDFC = "originpwdfc"
    SNOW = "snow"
    SPREE = "spree"
    SUNMOONDFC = "sunmoondfc"
    TOMBSTONE = "tombstone"
    WAXINGANDWANINGMOONDFC = "waxingandwaningmoondfc"


class Game(Enum):
    ARENA = "arena"
    ASTRAL = "astral"
    MTGO = "mtgo"
    PAPER = "paper"
    SEGA = "sega"


class ImageStatus(Enum):
    HIGHRES_SCAN = "highres_scan"
    LOWRES = "lowres"


class Lang(Enum):
    EN = "en"
    JA = "ja"


class Layout(Enum):
    ADVENTURE = "adventure"
    ART_SERIES = "art_series"
    AUGMENT = "augment"
    CASE = "case"
    CLASS = "class"
    DOUBLE_FACED_TOKEN = "double_faced_token"
    EMBLEM = "emblem"
    FLIP = "flip"
    HOST = "host"
    LEVELER = "leveler"
    MELD = "meld"
    MODAL_DFC = "modal_dfc"
    MUTATE = "mutate"
    NORMAL = "normal"
    PLANAR = "planar"
    PROTOTYPE = "prototype"
    SAGA = "saga"
    SCHEME = "scheme"
    SPLIT = "split"
    TOKEN = "token"
    TRANSFORM = "transform"
    VANGUARD = "vanguard"


class Alchemy(Enum):
    BANNED = "banned"
    LEGAL = "legal"
    NOT_LEGAL = "not_legal"
    RESTRICTED = "restricted"


class Legalities(BaseModel):
    standard: Alchemy
    future: Alchemy
    historic: Alchemy
    timeless: Alchemy
    gladiator: Alchemy
    pioneer: Alchemy
    explorer: Alchemy
    modern: Alchemy
    legacy: Alchemy
    pauper: Alchemy
    vintage: Alchemy
    penny: Alchemy
    commander: Alchemy
    oathbreaker: Alchemy
    standardbrawl: Alchemy
    brawl: Alchemy
    alchemy: Alchemy
    paupercommander: Alchemy
    duel: Alchemy
    oldschool: Alchemy
    premodern: Alchemy
    predh: Alchemy


class SchemeObject(Enum):
    CARD = "card"


class Preview(BaseModel):
    source: str
    source_uri: str
    previewed_at: datetime


class PromoType(Enum):
    ALCHEMY = "alchemy"
    BOOSTERFUN = "boosterfun"
    BRAWLDECK = "brawldeck"
    BUYABOX = "buyabox"
    CONVENTION = "convention"
    DATESTAMPED = "datestamped"
    EVENT = "event"
    FNM = "fnm"
    INSTORE = "instore"
    LEAGUE = "league"
    PLANESWALKERDECK = "planeswalkerdeck"
    PLASTIC = "plastic"
    PLAYERREWARDS = "playerrewards"
    PLAYTEST = "playtest"
    PRERELEASE = "prerelease"
    REBALANCED = "rebalanced"
    RELEASE = "release"
    RIPPLEFOIL = "ripplefoil"
    SETPROMO = "setpromo"
    STAMPED = "stamped"
    STARTERDECK = "starterdeck"
    SURGEFOIL = "surgefoil"
    THEMEPACK = "themepack"
    TOURNEY = "tourney"
    UPSIDEDOWN = "upsidedown"


class PurchaseUris(BaseModel):
    tcgplayer: str
    cardmarket: str
    cardhoarder: str


class Rarity(Enum):
    BONUS = "bonus"
    COMMON = "common"
    MYTHIC = "mythic"
    RARE = "rare"
    SPECIAL = "special"
    UNCOMMON = "uncommon"


class RelatedUris(BaseModel):
    gatherer: Optional[str] = None
    tcgplayer_infinite_articles: Optional[str] = None
    tcgplayer_infinite_decks: Optional[str] = None
    edhrec: Optional[str] = None


class SecurityStamp(Enum):
    ACORN = "acorn"
    ARENA = "arena"
    HEART = "heart"
    OVAL = "oval"
    TRIANGLE = "triangle"


class SetType(Enum):
    ALCHEMY = "alchemy"
    ARCHENEMY = "archenemy"
    ARSENAL = "arsenal"
    BOX = "box"
    COMMANDER = "commander"
    CORE = "core"
    DRAFT_INNOVATION = "draft_innovation"
    DUEL_DECK = "duel_deck"
    EXPANSION = "expansion"
    FUNNY = "funny"
    MASTERPIECE = "masterpiece"
    MASTERS = "masters"
    MEMORABILIA = "memorabilia"
    MINIGAME = "minigame"
    PLANECHASE = "planechase"
    PROMO = "promo"
    STARTER = "starter"
    TOKEN = "token"
    TREASURE_CHEST = "treasure_chest"
    VANGUARD = "vanguard"


class SchemeElement(BaseModel):
    object: SchemeObject
    id: UUID
    oracle_id: UUID
    multiverse_ids: List[int]
    name: str
    lang: Lang
    released_at: datetime
    uri: str
    scryfall_uri: str
    layout: Layout
    highres_image: bool
    image_status: ImageStatus
    cmc: float
    type_line: str
    color_identity: List[ColorIdentity]
    keywords: List[str]
    legalities: Legalities
    games: List[Game]
    reserved: bool
    foil: bool
    nonfoil: bool
    finishes: List[Finish]
    oversized: bool
    promo: bool
    reprint: bool
    variation: bool
    set_id: UUID
    set: str
    set_name: str
    set_type: SetType
    set_uri: str
    set_search_uri: str
    scryfall_set_uri: str
    rulings_uri: str
    prints_search_uri: str
    collector_number: str
    digital: bool
    rarity: Rarity
    artist: str
    border_color: BorderColor
    frame: Union[FrameEnum, int]
    full_art: bool
    textless: bool
    booster: bool
    story_spotlight: bool
    prices: Dict[str, Optional[str]]
    related_uris: RelatedUris
    mtgo_id: Optional[int] = None
    mtgo_foil_id: Optional[int] = None
    tcgplayer_id: Optional[int] = None
    cardmarket_id: Optional[int] = None
    image_uris: Optional[ImageUris] = None
    mana_cost: Optional[str] = None
    oracle_text: Optional[str] = None
    colors: Optional[List[ColorIdentity]] = None
    flavor_text: Optional[str] = None
    card_back_id: Optional[UUID] = None
    artist_ids: Optional[List[UUID]] = None
    illustration_id: Optional[UUID] = None
    edhrec_rank: Optional[int] = None
    purchase_uris: Optional[PurchaseUris] = None
    security_stamp: Optional[SecurityStamp] = None
    preview: Optional[Preview] = None
    power: Optional[Union[HandModifierEnum, int]] = None
    toughness: Optional[Union[HandModifierEnum, int]] = None
    penny_rank: Optional[int] = None
    arena_id: Optional[int] = None
    promo_types: Optional[List[PromoType]] = None
    all_parts: Optional[List[AllPart]] = None
    frame_effects: Optional[List[FrameEffect]] = None
    produced_mana: Optional[List[ColorIdentity]] = None
    watermark: Optional[str] = None
    card_faces: Optional[List[CardFace]] = None
    tcgplayer_etched_id: Optional[int] = None
    loyalty: Optional[str] = None
    life_modifier: Optional[str] = None
    hand_modifier: Optional[Union[HandModifierEnum, int]] = None
    attraction_lights: Optional[List[int]] = None
    color_indicator: Optional[List[ColorIdentity]] = None
    content_warning: Optional[bool] = None
    defense: Optional[int] = None
